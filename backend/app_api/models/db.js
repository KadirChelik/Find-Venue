var mongoose = require('mongoose');
require('dotenv').config();

var dbURL = "mongodb+srv://kadircelik:db201675@cluster0.hxi96qn.mongodb.net/mekanbul?retryWrites=true&w=majority";

mongoose.connect(dbURL);

mongoose.connection.on("connected", function(){
    console.log(dbURL + " Adresine Bağlandı");
});

mongoose.connection.on("error", function(){
    console.log(dbURL + " Adresine Bağlantı Başarısız");
});

mongoose.connection.on("disconnected", function(){
    console.log(dbURL + " Adresi ile Bağlantı Kesildi");
});

process.on("SIGINT", function () {
    mongoose.connection.close();
    console.log("Bağlantı kapatıldı");
    process.exit(0);
  });

require("./venue");
require("./user");
