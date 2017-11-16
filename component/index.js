import React from 'react';
import ReactDOM from 'react-dom';
import marked from 'marked';
import {Route, HashRouter as Router, Link , NavLink,Switch,Redirect} from 'react-router-dom';
import ReactDisqusThread from 'react-disqus-thread'

import Footer from './footer'
import SideBar from './sidebar'
import ArticlePage from './'
import PostPage  from './postpage';
import PagePage from './pagepage';
import Donate from './donate';
import ProjectPage from './projectpage';

const GITHUBNAME =`YuYanDev`
const GITHUBREPO =`YuYanDev.github.io`
// const HEXOPATH=`blog-react-1-G`

/** 
 * 页眉
 */

function Header(){
  return(
    <div>
    <section className="hero is-primary">  
    <div className="hero-head">
      <nav className="navbar">
        <div className="container">
          <div className="navbar-brand">
            <Link className="navbar-item " to="/" replace>
             毓彦的博客 
            </Link>            
            <Link className="navbar-item" to="/page/about" replace>关于</Link>
            <Link className="navbar-item " to="/archives" replace>归档</Link>
            <Link className="navbar-item " to="/page/Link" replace>友情链接</Link>
            <Link className="navbar-item " to="/project" replace>项目列表</Link>
            <span className="navbar-burger burger" data-target="navbarMenuHeroA">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>
          

        </div>
      </nav>
    </div> 
  </section>
  </div>
  )
}


/**
 * 首页列表
 * @param {*} props posts
 */

function Archives (props){
  return(
    <div>
      
      <section className="section">
        <div className="container">
          <div className="columns">
            <div className="column is-three-quarters">   
              { Object.entries(props.posts).map(function(item,index){
                //使用Object.entries的数据时`['1',[{对象}]]`的，于是在遍历完后留下`[{对象}]`。如果再map的话会触发react的bug,所以用字符串操作剔除首尾大括号，减少一层map绕开bug
                  var items = JSON.parse(JSON.stringify(item.slice(1)).substring(1,JSON.stringify(item.slice(1)).length-1));
                    return(
                      <div key={index}>
                        <article className="media">
                          <div className="media-left">
                          
                          </div>
                          <div className="media-content">
                            <div className="content">
                              <p>
                              <Link to={{pathname:'/post/'+items.slug+'/',state:{PostName:items.slug} }}>{items.title}</Link> 
                              <br/>
                  
                            </p>
                            </div>
                          </div>
                        </article>
                        <br/>                    
                      </div>
                    )         
                }) 
              }
            </div>
            <SideBar/>        
          </div>
        </div>
      </section>
    </div>
  )
}

/**
 * 路由配置
 * @param {*} props 
 */

function RouterPage(props){
  return(
    <div>
      <Router>
        <div>
        <Header/>
          <Switch>            
              <Route exact path="/" >
                {/* <PostList posts={props.data.posts}/> */}
                <Redirect to="/article/1"/>
              </Route>   
              <Route path="/post/:postId" component={<PostPage/>}/>
              <Route path="/page/:pageId" component={<PagePage/>}/>
              <Route path="/article/:articleId" >
                <ArticlePage posts={props.data.posts}/>
              </Route>
              <Route path="/archives" >
                <Archives posts={props.data.posts}/>
              </Route>
              <Route path="/archives/:Aid" >
                <Archives posts={props.data.posts}/>
              </Route>
              <Route path="/project/"component={<ProjectPage/>}/>
              <Route path="/donate/"component={<Donate/>}/>
          </Switch>
          </div>
      </Router>
    </div>
  )
}

/**
 * 添加渲染
 * @param {*} props 
 */
function IndexPage(props){
  return(
    <div>      
      <RouterPage data = {props.data}/>
      <Footer/>
    </div>
  )
}

fetch(`https://raw.githubusercontent.com/${GITHUBNAME}/${GITHUBREPO}/master/content.json?ref=master`).then(function(data) {
  return data.json()
}).then(function(json){
  ReactDOM.render(<IndexPage data={json}/>, document.getElementById('app'));
}).catch(function(e) {
  console.log(e);
});