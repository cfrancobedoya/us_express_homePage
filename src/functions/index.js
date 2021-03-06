const functions = require('firebase-functions');
const express = require('express');

const puppeteer = require('puppeteer');
const $ = require('cheerio');
const engines = require('consolidate');

const app = express();
app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');

var product;

app.get('/productDetail', (req, res) => {
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  res.render('detalleProducto', { product });
})

app.post('/timestamp', (req, res) => { 
  let url= req.body.link;
  var page;  
  puppeteer  
  .launch()
  .then( (browser) =>{
    return browser.newPage();
    
  })    
  .then((pageReq)=>{
    page = pageReq;
    return page.goto(url)
  })
  .then(()=>{
    return page.content();
  })
  .then((html) =>{	
    let name = $('#productTitle', html).text();    
    let price = $('#priceblock_ourprice', html).text();
    let urlPhoto = $('#landingImage', html).attr('src');
    console.log(name);
    console.log(price);
    console.log(urlPhoto);
    product = {
      "nombre": name,
      "precio": price,
      "url": urlPhoto
    }
    // return res.send(product);
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');    
    return res.render('detalleProducto', { product });    
  })  
  .catch( (err) =>{
	  //handle error
	  console.error(err);
  });  
});



exports.app = functions.https.onRequest(app);