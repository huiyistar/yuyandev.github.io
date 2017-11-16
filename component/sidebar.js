import React from 'react';

const GITHUBNAME =`YuYanDev`
const GITHUBREPO =`YuYanDev.github.io`

export default class SideBar extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      FriendLinks: [],
      LastCommit:''
    };
  }
  componentDidMount() {
    async function fetchAsyncPostMarkdown () {
      let response = await fetch(`https://raw.githubusercontent.com/${GITHUBNAME}/${GITHUBREPO}/master/links.json`);
      
      let data = await response.json();
      return data;
    }
    
    fetchAsyncPostMarkdown()
    .then(data => {this.setState({
      FriendLinks: data
    });})
    .catch(reason => console.log(reason.message))
    
    async function fetchAsyncLastCommit () {
      let response = await fetch(`https://api.github.com/repos/${GITHUBNAME}/${GITHUBREPO}`);
      
      let data = await response.json();
      return data;
    }

    fetchAsyncLastCommit()
    .then(data => {this.setState({
      LastCommit: data.pushed_at.replace(/T/g," ").replace(/Z/g," GMT")
    });})
    .catch(reason => console.log(reason.message))
  }
  render() {
    return(
      <div className="column">

        <div>
          <small>Last update: </small>
          <br/>
          <small>{this.state.LastCommit}</small>
          <br/>
          <br/>
          <small>博客Travis-Ci构建状态:</small>
         
          <br/>
          <a href="https://travis-ci.org/YuYanDev/yuyandev.github.io"><img src="https://travis-ci.org/YuYanDev/yuyandev.github.io.svg?branch=source" alt="svg"/></a>
        </div>

        <hr/>

        <div >
          
          <small>如果你想支持网站的发展的话，可以通过通过Patreon或者支付宝来给毓彦提供资金资助</small>
          <br/>
          <br/>
          <a className="button is-info is-outlined " href="https://www.patreon.com/bePatron?c=1325706">Patreon</a> <Link to="/donate/alipay" className="button is-info is-outlined">支付宝</Link>
          <br/>
          <small>详情点击 ：<Link to="/donate/">Donate</Link></small>
        </div>

        <hr/>

        <div>
          <strong>友情链接</strong>
          { Object.entries(this.state.FriendLinks).map(function(item,index){
           var items = JSON.parse(JSON.stringify(item.slice(1)).substring(1,JSON.stringify(item.slice(1)).length-1));
           return(
              <p key={index}>
                <small><a href={items.link}>{items.name}</a></small>               
              </p>
           )
          })}
        </div>

        <hr/>

      </div> 
    )
  }
}