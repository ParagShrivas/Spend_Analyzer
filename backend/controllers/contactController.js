const contactModel =  require('../models/contactModel');

exports.sendMessage = (req,res)=>{
    contactModel.sendMessage(req,res);
}