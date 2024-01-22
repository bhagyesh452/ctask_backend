const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const adminModel = require("./models/Admin");
const CompanyModel = require("./models/Leads");
const RequestModel = require("./models/Request");
const RequestGModel = require("./models/RequestG");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb://localhost:27017/AdminTable")
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch((err) => {
    console.log(err);
  });
// const secretKey = 'random32numberjsonwebtokenrequire';
const secretKey = process.env.SECRET_KEY || "mydefaultsecret";
console.log(secretKey);

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  // Simulate user authentication (replace with actual authentication logic)
  // (u) => u.email === username && u.password === password
  // const user = await adminModel.find();
  const user = await adminModel.findOne({
    email: username,
    password: password,
  });
  console.log(user);
  if (user) {
    // Generate a JWT token
    console.log("user is appropriate");
    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "1h",
    });
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// Login for employee

app.post("/employeelogin", async (req, res) => {
  const { email, password } = req.body;

  // Replace this with your actual Employee authentication logic
  const user = await adminModel.findOne({ email: email, password: password });
  console.log(user);

  if (user) {
    const newtoken = jwt.sign({ employeeId: user._id }, secretKey, {
      expiresIn: "1h",
    });
    res.json({ newtoken });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

const deleteAllData = async () => {
  try {
    const result = await CompanyModel.deleteMany({});
    console.log(` documents deleted successfully.`);
  } catch (error) {
    console.error("Error deleting documents:", error.message);
  } finally {
    mongoose.connection.close();
  }
};

// deleteAllData();

app.post("/api/leads", async (req, res) => {
  const csvData = req.body;

  try {
    for (const employeeData of csvData) {
      try {
        const employeeWithAssignData = {
          ...employeeData,
          AssignDate: new Date(),
        };
        const employee = new CompanyModel(employeeWithAssignData);
        const savedEmployee = await employee.save();
        console.log("Data sent successfully");
      } catch (error) {
        console.error("Error saving employee:", error.message);
        // res.status(500).json({ error: 'Internal Server Error' });

        // Handle the error for this specific entry, but continue with the next one
      }
    }

    res.status(200).json({ message: "Data sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    console.error("Error in bulk save:", error.message);
  }
});

app.post("/api/manual", async (req, res) => {
  const receivedData = req.body;

  // console.log(receivedData);

  try {
    const employee = new CompanyModel(receivedData);
    const savedEmployee = await employee.save();
    console.log("Data sent");
    res
      .status(200)
      .json(savedEmployee || { message: "Data sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    console.error("Error saving employee:", error.message);
  }
});

app.post("/update-status/:id", async (req, res) => {
  const { id } = req.params;
  const { newStatus } = req.body;

  try {
    // Update the status field in the database based on the employee id
    await CompanyModel.findByIdAndUpdate(id, { Status: newStatus });
    console.log("Data Updated");
    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post("/update-remarks/:id", async (req, res) => {
  const { id } = req.params;
  const { Remarks } = req.body;

  try {
    // Update the status field in the database based on the employee id
    await CompanyModel.findByIdAndUpdate(id, { Remarks: Remarks });
    console.log("Data Updated");
    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/einfo", async (req, res) => {
  try {
    console.log(req.body);

    adminModel.create(req.body).then((respond) => {
      res.json(respond);
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/einfo", async (req, res) => {
  try {
    const data = await adminModel.find();
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/api/leads", async (req, res) => {
  try {
    const data = await CompanyModel.find();
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/einfo/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Use findByIdAndDelete to delete the document by its ID
    const deletedData = await adminModel.findByIdAndDelete(id);

    if (!deletedData) {
      return res.status(404).json({ error: "Data not found" });
    }

    res.json({ message: "Data deleted successfully", deletedData });
  } catch (error) {
    console.error("Error deleting data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// delete from leads

app.delete("/api/leads/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Use findByIdAndDelete to delete the document by its ID
    const deletedData = await CompanyModel.findByIdAndDelete(id);
    if (!deletedData) {
      return res.status(404).json({ error: "Data not found" });
    }

    res.json({ message: "Data deleted successfully", deletedData });
  } catch (error) {
    console.error("Error deleting data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// delete selected rows

app.delete("/api/delete-rows", async (req, res) => {
  const { selectedRows } = req.body;

  try {
    // Use Mongoose to delete rows by their IDs
    await CompanyModel.deleteMany({ _id: { $in: selectedRows } });

    res.status(200).json({ message: "Rows deleted successfully" });
  } catch (error) {
    console.error("Error deleting rows:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/einfo/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const updatedData = await adminModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedData) {
      return res.status(404).json({ error: "Data not found" });
    }

    res.json({ message: "Data updated successfully", updatedData });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// app.put('/ecompany/:ename', async (req, res) => {
//   const name = req.params.id;

//   try {
//     const updatedData = await CompanyModel.find({ename : name}, { new: true });

//     if (!updatedData) {
//       return res.status(404).json({ error: 'Data not found' });
//     }

//     res.json({ message: 'Data updated successfully', updatedData });
//   } catch (error) {
//     console.error('Error updating data:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// Assigning data

app.post("/api/postData", async (req, res) => {
  const { employeeSelection, selectedObjects } = req.body;
  // Check if data is already assigned
  // if (selectedObjects.every((obj) => obj.ename === employeeSelection)) {
  //   return res.status(400).json({ error: `Data is already assigned to ${employeeSelection}` });
  // }

  console.log(employeeSelection, selectedObjects);

  // If not assigned, post data to MongoDB or perform any desired action
  const updatePromises = selectedObjects.map((obj) => {
    // Add AssignData property with the current date
    const updatedObj = {
      ...obj,
      ename: employeeSelection,
      AssignDate: new Date(),
    };
    return CompanyModel.updateOne({ _id: obj._id }, updatedObj);
  });

  // Execute all update promises
  await Promise.all(updatePromises);

  res.json({ message: "Data posted successfully" });
});

app.post("/api/company", async (req, res) => {
  const { newemployeeSelection, csvdata } = req.body;

  try {
    const insertedCompanies = [];

    for (const company of csvdata) {
      // Check for duplicate based on some unique identifier, like companyNumber
      const isDuplicate = await CompanyModel.exists({
        "Company Name": company["Company Name"],
      });

      if (!isDuplicate) {
        // If not a duplicate, add ename and insert into the database
        const companyWithEname = {
          ...company,
          ename: newemployeeSelection,
          AssignDate: new Date(),
        };

        const insertedCompany = await CompanyModel.create(companyWithEname);
        insertedCompanies.push(insertedCompany);
      } else {
        console.log(
          `Duplicate entry found for companyNumber: ${company["Company Name"]}. Skipped.`
        );
      }
    }

    res.json(insertedCompanies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// get the company data,
app.get("/api/employees/:ename", async (req, res) => {
  try {
    const employeeName = req.params.ename;

    // Fetch data from companyModel where ename matches employeeName
    const data = await CompanyModel.find({ ename: employeeName });

    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// for inserting more values to einfo
app.put("/neweinfo/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const existingData = await adminModel.findById(id);

    if (!existingData) {
      return res.status(404).json({ error: "Data not found" });
    }

    // Map the incoming data to a format suitable for comparison
    const incomingData = req.body.cInfo.map((data) => ({
      "Company Name": data["Company Name"],
      "Company Number": data["Company Number"],
      "Company Incorporation Date  ": data["Company Incorporation Date  "],
      "Company Email": data["Company Email"],
      City: data.City,
      State: data.State,
    }));

 

    // Filter out existing entries from the incoming data
    const newData = incomingData.filter((data) => {
      return !existingData.cInfo.some((existing) => {
        return (
          existing["Company Name"] === data["Company Name"] &&
          existing["Company Number"] === data["Company Number"] &&
          existing["Company Incorporation Date  "] ===
            data["Company Incorporation Date  "] &&
          existing["Company Email"] === data["Company Email"] &&
          existing.City === data.City &&
          existing.State === data.State
        );
      });
    });

    // Add the filtered data to the existing array
    existingData.cInfo.push(...newData);

    // Save the updated document
    const updatedData = await existingData.save();

    res.json({ message: "Data updated successfully", updatedData });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.put("/newcompanyname/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { ename } = req.body;

    // Validate if 'ename' is provided
    if (!ename) {
      return res
        .status(400)
        .json({ error: "Ename is required for update" });
    }

    // Find and update the company data
    const updatedData = await CompanyModel.findByIdAndUpdate(
      id,
      { ename: ename },
      { new: true }
    );

    // Check if data was found and updated
    if (!updatedData) {
      return res.status(404).json({ error: "Company data not found" });
    }

    res.json({ message: "Company data updated successfully", updatedData });
  } catch (error) {
    console.error("Error updating company data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// api call for employee requesting for the data

app.post("/api/requestData", async (req, res) => {
  const { selectedYear, companyType, numberOfData, name } = req.body;

  try {
    // Create a new RequestModel instance
    const newRequest = new RequestModel({
      year: selectedYear,
      ctype: companyType,
      dAmount: numberOfData,
      ename: name,
    });

    // Save the data to MongoDB
    const savedRequest = await newRequest.save();

    res.json(savedRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post("/api/requestgData", async (req, res) => {
  const { numberOfData, name } = req.body;

  try {
    // Create a new RequestModel instance
    const newRequest = new RequestGModel({
      dAmount: numberOfData,
      ename: name,
    });

    // Save the data to MongoDB
    const savedRequest = await newRequest.save();

    res.json(savedRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/requestData", async (req, res) => {
  try {
    // Retrieve all data from RequestModel
    const allData = await RequestModel.find();
    res.json(allData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/api/requestgData", async (req, res) => {
  try {
    // Retrieve all data from RequestModel
    const allData = await RequestGModel.find();
    res.json(allData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/api/requestData/:id", async (req, res) => {
  const { id } = req.params;
  const { read } = req.body;

  try {
    // Update the 'read' property in the MongoDB model
    const updatedNotification = await RequestModel.findByIdAndUpdate(
      id,
      { read },
      { new: true }
    );

    if (!updatedNotification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json(updatedNotification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.put("/api/requestgData/:id", async (req, res) => {
  const { id } = req.params;
  const { read } = req.body;

  try {
    // Update the 'read' property in the MongoDB model
    const updatedNotification = await RequestGModel.findByIdAndUpdate(
      id,
      { read },
      { new: true }
    );

    if (!updatedNotification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json(updatedNotification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(3001, () => {
  console.log("Server is running");
});
