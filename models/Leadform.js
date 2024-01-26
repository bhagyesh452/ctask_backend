const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    bdmName: String,
    bdmEmail: String,
    bdmType: String,
    supportedBy: Boolean,
    bookingDate: Date,
    caCase: String,
    caNumber: Number,
    caEmail: String,
    caCommission: String,
    companyName: String,
    contactNumber: Number,
    companyEmail: String,
    services: String,
    originalTotalPayment: Number,
    totalPayment: Number,
    paymentTerms: String,
    paymentMethod: String,
    firstPayment: Number,
    secondPayment: Number,
    thirdPayment: Number,
    fourthPayment: Number,
    paymentReceipt: String,
    bookingSource: String,
    cPANorGSTnum: Number,
    incoDate: Date,
    extraNotes: String,
    otherDocs: String,
});

const LeadModel = mongoose.model('Leadform', leadSchema);

module.exports = LeadModel;
