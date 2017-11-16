const a = [{
  "title": "HBUT 2nd ACM Contest",
  "slug": "HBUT-2ACM",
  "date": "un00fin00",
  "updated": "un44fin44",
  "comments": true,
  "path": "post/HBUT-2ACM/",
  "link": "",
  "permalink": "https://emiria.io/post/HBUT-2ACM/",
  "tags": []
}, {
  "title": "React与Express项目前后端一体化实战",
  "slug": "react-express",
  "date": "un44fin44",
  "updated": "un44fin44",
  "comments": true,
  "path": "post/react-express/",
  "link": "",
  "permalink": "https://emiria.io/post/react-express/",
  "tags": []
}, {
  "title": "一个非常好用的npm包管理工具npm-check",
  "slug": "npm-check",
  "date": "un00fin00",
  "updated": "un44fin44",
  "comments": true,
  "path": "post/npm-check/",
  "link": "",
  "permalink": "https://emiria.io/post/npm-check/",
  "tags": []
}, {
  "title": "在墙内部署docker镜像的正确姿势",
  "slug": "docker_cn",
  "date": "un22fin22",
  "updated": "un44fin44",
  "comments": true,
  "path": "post/docker_cn/",
  "link": "",
  "permalink": "https://emiria.io/post/docker_cn/",
  "tags": []
}, {
  "title": "Dell R410服务器踩坑总结",
  "slug": "DellR410-BIOS",
  "date": "un55fin55",
  "updated": "un44fin44",
  "comments": true,
  "path": "post/DellR410-BIOS/",
  "link": "",
  "permalink": "https://emiria.io/post/DellR410-BIOS/",
  "tags": []
}, {
  "title": "Omega2Plus上手体验",
  "slug": "Omega2-Getstart",
  "date": "un66fin66",
  "updated": "un44fin44",
  "comments": true,
  "path": "post/Omega2-Getstart/",
  "link": "",
  "permalink": "https://emiria.io/post/Omega2-Getstart/",
  "tags": []
}];



//console.log(Object.entries(a));
  var result = Object.entries(a);
//  for (var i of Object.entries(a)) {
//       var item=i.slice(1);
//       var items = JSON.stringify(item);
//       var itemss = items.length
//       var itemsss = items.substring(1,itemss-1)
//       var itemssss = JSON.parse(itemsss);      

//       console.log(itemssss.title);    
// }
Object.entries(a).map(function(item){
 // var items = JSON.stringify(item.slice(1));
  //var length = JSON.stringify(item.slice(1)).length
  var items = JSON.parse(JSON.stringify(item.slice(1)).substring(1,JSON.stringify(item.slice(1)).length-1));
  console.log(items.title);
})  

//console.log(result);
// Object.entries(a).map(function(item){
//     item.slice(1).map(function(items){
//     console.log(items.title+'\n\n')
// });
// })

//console.log(a.map(Object.entries(a)));