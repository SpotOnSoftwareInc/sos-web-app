
var cl = cloudinary.Cloudinary.new( {cloud_name: "ha9cind6w"});


//this is supposed to be the upload button
$('.upload_form').append($.cloudinary.unsigned_upload_tag("fxavqm7k", 
  { cloud_name: 'ha9cind6w' }));