var parser = new UAParser();
var result = parser.getResult();
var jrx =0;
if(result.browser.name="Chrome"){
  if(result.browser.major>=46){
    jrx =1;
  };
}
if(result.browser.name="Firefox"){
  if(result.browser.major>=52){
    jrx =1;
  };
}
if(result.browser.name="Edge"){
  if(result.browser.major>=12){
    jrx =1;
  };
}
if(result.browser.name="Mozilla"){
  if(result.browser.major>=52){
    jrx =1;
  };
}
if(result.browser.name="Safari"){
  if(result.browser.major>=11){
    jrx =1;
  };
}

if(result.os.name=='iOS'){    
  if(result.os.version>='11'){
    if(result.browser.name="Safari"){
      if(result.browser.major>=11){
        jrx =1;
      };
    }
  }
}
if(result.os.name=='Android'){    
  if(result.os.version>='7'){
    jrx =1;
  }
}
if(jrx==0){
  window.location.href='/compatibility.html'
}