import React from 'react';
import ReactDisqusThread from 'react-disqus-thread'
import SideBar from './sidebar';

const GITHUBNAME =`YuYanDev`
const GITHUBREPO =`YuYanDev.github.io`

export default class PagePage extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      PageApiBackName: '',
      PageApiBackcContent: '',
      PageURL: ''
    };
  }
  componentDidMount() {
    window.scrollTo(0, 0)
    /**
     * 根据hash路由筛选出文章文件
     */
    var pageLink;
    var pathNames = window.location.hash;
    var arrpath=pathNames.split("/");
    
    for(var x in arrpath){
      if(arrpath[x]!="page"){
        if(arrpath[x]!=""){
          if(arrpath[x]!="#"){
            pageLink = arrpath[x];
          }
        }
      }
    }

    var path = pageLink;
    /**
     * 多次使用浏览器base64转码api来解决github返回的api乱码问题
     */
    function utf8_to_b64(str) {
      return window.btoa(unescape(encodeURIComponent(str)));
    }

    function b64_to_utf8(str) {
      return decodeURIComponent(escape(window.atob(str)));
    }
    /**
     * 异步请求抓取markdown的text文档
     */
    async function fetchAsyncPageMarkdown () {
      let response = await fetch(`https://api.github.com/repos/${GITHUBNAME}/${GITHUBREPO}/contents/source/${path}/index.md?ref=master`);
      
      let data = await response.json();
      return data;
    }
    this.setState({
      PostURL: '/#/Page/'+pageLink
    })
    
    fetchAsyncPageMarkdown()
    .then(data => {this.setState({
      PageApiBackName: data.name,
      PageApiBackcContent: marked(b64_to_utf8(utf8_to_b64(b64_to_utf8(data.content))).replace(/---\ntitle:/g,'### ').replace(/date:/g,'\n##### '))
      //PostApiBackcContent: marked(data.content)
    });})
    .catch(reason => console.log(reason.message))

  }

  render() {
    return (
      <div>
        
       <section className="section">
          <div className="container">
            <div className="columns ">
              <div className="column is-three-quarters">
                <div className="box ">
                  <div className="markdown-body" dangerouslySetInnerHTML={{__html: this.state.PageApiBackcContent}}></div>
                </div>
              </div>
              <SideBar/> 
            </div>
            
          </div>
        </section>
      </div>
    );
  }
}