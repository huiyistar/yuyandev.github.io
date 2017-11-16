import React from 'react';
import ReactDisqusThread from 'react-disqus-thread'
import SideBar from './sidebar';

const GITHUBNAME =`YuYanDev`
const GITHUBREPO =`YuYanDev.github.io`

export default class PostPage extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      PostApiBackName: '',
      PostApiBackcContent: '',
      PostURL: ''
    };
  }
  componentDidMount() {
    window.scrollTo(0, 0)
    /**
     * 根据hash路由筛选出文章文件
     */
    var postLink;
    var pathName = window.location.hash;
    var arrpath=pathName.split("/");
    
    for(var x in arrpath){
      if(arrpath[x]!="post"){
        if(arrpath[x]!=""){
          if(arrpath[x]!="#"){
            postLink = arrpath[x];
          }
        }
      }
    }

    var path = postLink;
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
    async function fetchAsyncPostMarkdown () {
      let response = await fetch(`https://api.github.com/repos/${GITHUBNAME}/${GITHUBREPO}/contents/source/_posts/${path}.md?ref=master`);
      
      let data = await response.json();
      return data;
    }
    this.setState({
      PostURL: '/blog/#/post/'+postLink
    })
    
    fetchAsyncPostMarkdown()
    .then(data => {this.setState({
      PostApiBackName: data.name,
      PostApiBackcContent: marked(b64_to_utf8(utf8_to_b64(b64_to_utf8(data.content))).replace(/---\ntitle:/g,'### ').replace(/date:/g,'\n##### '))
      //PostApiBackcContent: marked(data.content)
    });})
    .catch(reason => console.log(reason.message))

  }

  handleNewComment(){
    console.log(comment.text);
  }

  render() {
    return (
      <div>
       
       <section className="section">
          <div className="container">
            <div className="columns">
              <div className="column is-three-quarters">
                <div className="box ">
                  <div className="markdown-body" dangerouslySetInnerHTML={{__html: this.state.PostApiBackcContent}}></div>
                  <hr/>
              
                  <ReactDisqusThread shortname="github-sakura" onNewComment={this.handleNewComment}/>
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