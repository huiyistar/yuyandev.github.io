// require('es5-shim'); require('es5-shim/es5-sham');
// require('console-polyfill');
import React from 'react';
import ReactDOM from 'react-dom';
import marked from 'marked';
import {
  Route,
  HashRouter as Router,
  Link,
  NavLink,
  Switch,
  Redirect
} from 'react-router-dom';
import ReactDisqusThread from 'react-disqus-thread';
import moment from "moment";
import "isomorphic-fetch";
import "babel-polyfill";
import './static/bulma.min.css';
import './static/github-markdown.css';

var GITHUBNAME = `YuYanDev`;
var GITHUBREPO = `YuYanDev.github.io`;

/**
 *
 * 页眉
 */

function Header() {
  return (
    <div>
      <section className="hero is-primary">
        <div className="hero-head">
          <nav id="navbar" className="navbar is-fixed-top is-transparent">
            <div id="specialShadow" className="bd-special-shadow"></div>

            <div className="container">

              <div className="navbar-brand">
                <Link className="navbar-item " to="/" replace>毓彦的博客</Link>
                <Link className="navbar-item is-hidden-desktop" to="/mobile/menu">
                  菜单</Link>
              </div>

              <div id="navMenuIndex" className="navbar-menu">
                <div className="navbar-start">
                  <Link className="navbar-item" to="/page/about" replace>关于</Link>
                  <Link className="navbar-item " to="/archives" replace>归档</Link>
                  <Link className="navbar-item " to="/page/Link" replace>友情链接</Link>
                  <Link className="navbar-item " to="/project" replace>项目列表</Link>
                </div>

                <div className="navbar-end"></div>
              </div>

            </div>
          </nav>
        </div>
      </section>
    </div>
  )
}

function MobileMenu() {
  return (
    <section className="section">
      <div className="container">
        <div className="columns">
          <div className="column is-three-quarters">
            <div >
              <div >
                <aside className="menu">
                  <p className="menu-label">
                    菜单
                  </p>
                  <ul className="menu-list">
                    <li>
                      <Link to="/" replace>首页</Link>
                    </li>
                    <li>
                      <Link to="/page/about" replace>关于</Link>
                    </li>
                    <li>
                      <Link to="/archives" replace>归档</Link>
                    </li>
                    <li>
                      <Link to="/page/Link" replace>友情链接</Link>
                    </li>
                    <li>
                      <Link to="/project" replace>项目列表</Link>
                    </li>
                  </ul>

                </aside>
                <hr/>
              </div>
            </div>

          </div>
          <SideBar/>
        </div>
      </div>
    </section>
  )
}

/**
 * 页脚
 */

export class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Hitokoto: '',
      HitokotoCatname: ''
    };
  }
  componentDidMount() {
    function randomNum(minNum, maxNum) {
      switch (arguments.length) {
        case 1:
          return parseInt(Math.random() * minNum + 1, 10);
          break;
        case 2:
          return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
          break;
        default:
          return 0;
          break;
      }
    }

    async function fetchAsyncPostMarkdown() {
      let response = await fetch(`https://raw.githubusercontent.com/${GITHUBNAME}/${GITHUBREPO}/master/hitokoto.json`);
      let data = await response.json();
      return data;
    }
    fetchAsyncPostMarkdown().then(data => {
      var SubHitokoto = 0
      for (var b in data) {
        if (data[b].id) {
          SubHitokoto = SubHitokoto + 1;
        }
      }
      var HtokotoId = randomNum(0, SubHitokoto);
      this.setState({
        Hitokoto: unescape(data[HtokotoId].hitokoto.replace(/\\u/g, '%u')),
        HitokotoCatname: unescape(data[HtokotoId].catname.replace(/\\u/g, '%u'))
      });
    }).catch(reason => console.log(reason.message))
  }
  render() {
    return (
      <div>
        <footer className="footer">
          <div className="container">
            <div className="columns is-centered">
              <div className="column is-three-quarters">
                <div className="columns ">
                  <div className="column is-three-quarters">
                    <div className="content ">
                      <div></div>
                      <br/>
                      <p>
                        © 2015 - 2017 毓彦的博客
                      </p>

                      <img alt="知识共享许可协议" src="/static/by-sa.svg" width="88" height="31"/><br/>本网站文章采用<a href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a>进行许可。

                    </div>
                  </div>
                  <div className="column ">
                    <div className="content ">
                      <div>
                        <br/>
                      </div>
                      <p>
                        <strong>一言</strong>
                      </p>
                      <p>
                        {this.state.Hitokoto}
                      </p>
                      <p>
                        <small>来源: {this.state.HitokotoCatname}</small>
                      </p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </footer>
      </div>
    )
  }
}

/**
 * 侧边栏
 */
export class SideBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      FriendLinks: [],
      LastCommit: ''
    };
  }
  componentDidMount() {
    async function fetchAsyncPostMarkdown() {
      let response = await fetch(`https://raw.githubusercontent.com/${GITHUBNAME}/${GITHUBREPO}/master/links.json`);

      let data = await response.json();
      return data;
    }

    fetchAsyncPostMarkdown().then(data => {
      this.setState({FriendLinks: data});
    }).catch(reason => console.log(reason.message));
    async function fetchAsyncLastCommit() {
      let response = await fetch(`https://api.github.com/repos/${GITHUBNAME}/${GITHUBREPO}`);

      let data = await response.json();
      return data;
    }

    fetchAsyncLastCommit().then(data => {
      this.setState({
        LastCommit: moment(data.pushed_at).from(moment().format())
      });
    }).catch(reason => console.log(reason.message))
  }
  render() {
    return (
      <div className="column">

        <div>
          <small>Last update: {this.state.LastCommit}</small>
          <br/>
          <br/>
          <small>博客Travis-Ci构建状态:</small>

          <br/>
          <a href="https://travis-ci.org/YuYanDev/yuyandev.github.io/builds"><img
            src="https://travis-ci.org/YuYanDev/yuyandev.github.io.svg?branch=source"
            alt="svg"/></a>
        </div>

        <hr/>

        <div >

          <small>如果你想支持网站的发展的话，可以通过通过Patreon或者支付宝来给毓彦提供资金资助</small>
          <br/>
          <br/>
          <a
            className="button is-info is-outlined "
            href="https://www.patreon.com/bePatron?c=1325706">Patreon</a>
          <Link to="/donate/alipay" className="button is-info is-outlined">支付宝</Link>
          <br/>
          <small>详情点击 ：<Link to="/donate/">Donate</Link>
          </small>
        </div>

        <hr/>

        <div>
          <strong>友情链接</strong>
          {Object
            .entries(this.state.FriendLinks)
            .map(function (item, index) {
              var items = JSON.parse(JSON.stringify(item.slice(1)).substring(1, JSON.stringify(item.slice(1)).length - 1));
              return (
                <p key={index}>
                  <small>
                    <a href={items.link}>{items.name}</a>
                  </small>
                </p>
              )
            })}
        </div>

        <hr/>

      </div>
    )
  }
}

function NoMatch() {
  return (
    <section className="section">
      <div className="container">
        <div className="columns">
          <div className="column is-three-quarters">
            <article className="media">
              <div className="media-left"></div>
              <div className="media-content">
                <div className="content">
                  <h5>Not Found
                  </h5>
                  <p>
                    <small>似乎页面输错了地址</small>
                    <br/>
                    <small>仔细检查一下</small>
                    <strong>
                      -OR-
                    </strong>
                    <small>去Github上反馈bugs</small>
                    <br/>
                    <small>
                      <Link to="/">返回首页</Link>
                    </small>
                  </p>
                </div>
              </div>
            </article>
          </div>
          <SideBar/>
        </div>
      </div>
    </section>
  )
}

/**
 *
 * @param {*} props posts
 */

function Archives(props) {
  return (
    <div>

      <section className="section">
        <div className="container">
          <div className="columns">
            <div className="column is-three-quarters">
              {Object
                .entries(props.posts)
                .map(function (item, index) {
                  // 使用Object.entries的数据时`['1',[{对象}]]`的，于是在遍历完后留下`[{对象}]`。如果再map的话会触发react的bug,所以
                  // 用 字符串操作剔除首尾大括号，减少一层map绕开bug
                  var items = JSON.parse(JSON.stringify(item.slice(1)).substring(1, JSON.stringify(item.slice(1)).length - 1));
                  return (
                    <div key={index}>
                      <article className="media">
                        <div className="media-left"></div>
                        <div className="media-content">
                          <div className="content">
                            <p>
                              <Link
                                to={{
                                pathname: '/post/' + items.slug + '/',
                                state: {
                                  PostName: items.slug
                                }
                              }}>{items.title}</Link>
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
 * 文章列表分页
 */

export class ArticlePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ArticleData: this.props.posts,
      thisPageExportData: [],
      articleId: '',
      totalPage: '',
      articleIdLast: '',
      articleIdNext: ''
    };
  }
  componentDidMount() {

    var arrpath = window
      .location
      .hash
      .split("/");
    var articleId;
    for (var x in arrpath) {
      if (arrpath[x] != "article") {
        if (arrpath[x] != "") {
          if (arrpath[x] != "#") {
            articleId = arrpath[x];
          }
        }
      }
    }

    var SubArticle = 0
    for (var b in this.state.ArticleData) {
      if (this.state.ArticleData[b].title) {
        SubArticle = SubArticle + 1;
      }
    }

    var totalPage = Math.ceil(SubArticle / 5) //计算出总共页数
    var thisPageExportData;
    var thisPageExportitems = '';
    var PageArticle = Object.entries(this.state.ArticleData)

    for (var c = articleId * 5 - 1; c >= (articleId - 1) * 5; c--) {
      if (PageArticle[c]) {
        thisPageExportitems = JSON
          .stringify(PageArticle[c].slice(1))
          .substring(1, JSON.stringify(PageArticle[c].slice(1)).length - 1) + ',' + thisPageExportitems;
      }
    }
    thisPageExportitems = '[' + thisPageExportitems.substring(0, thisPageExportitems.length - 1) + ']'

    var articleIdNext
    if (articleId == totalPage) {
      articleIdNext : false
    } else {
      articleIdNext = parseInt(articleId) + 1
    }

    var articleIdLast
    if (articleId == 1) {
      articleIdLast : false
    } else {
      articleIdLast = parseInt(articleId) - 1
    }

    this.setState({
      thisPageExportData: JSON.parse(thisPageExportitems),
      articleId: articleId,
      totalPage: totalPage,
      articleIdNext: articleIdNext,
      articleIdLast: articleIdLast
    })
  }

  componentWillMount() {
    // componentDidUpdate() {
    var arrpath = window
      .location
      .hash
      .split("/");
    var articleId;
    for (var x in arrpath) {
      if (arrpath[x] != "article") {
        if (arrpath[x] != "") {
          if (arrpath[x] != "#") {
            articleId = arrpath[x];
          }
        }
      }
    }
    if (articleId != this.state.articleId) {
      window.scrollTo(0, 0)
      clearInterval(this.state.articleId)
      clearInterval(this.state.thisPageExportData)

      var SubArticle = 0
      for (var b in this.state.ArticleData) {
        if (this.state.ArticleData[b].title) {
          SubArticle = SubArticle + 1;
        }
      }

      var totalPage = Math.ceil(SubArticle / 5) //计算出总共页数
      var thisPageExportData;
      var thisPageExportitems = '';
      var PageArticle = Object.entries(this.state.ArticleData)

      for (var c = articleId * 5 - 1; c >= (articleId - 1) * 5; c--) {
        if (PageArticle[c]) {
          thisPageExportitems = JSON
            .stringify(PageArticle[c].slice(1))
            .substring(1, JSON.stringify(PageArticle[c].slice(1)).length - 1) + ',' + thisPageExportitems;
        }
      }
      thisPageExportitems = '[' + thisPageExportitems.substring(0, thisPageExportitems.length - 1) + ']'

      var articleIdNext
      if (articleId == totalPage) {
        articleIdNext : false
      } else {
        articleIdNext = parseInt(articleId) + 1
      }

      var articleIdLast
      if (articleId == 1) {
        articleIdLast : false
      } else {
        articleIdLast = parseInt(articleId) - 1
      }

      this.setState({
        thisPageExportData: JSON.parse(thisPageExportitems),
        articleId: articleId,
        articleIdLast: articleIdLast,
        articleIdNext: articleIdNext
      })
    }
  }

  render() {
    return (
      <div>

        <section className="section">
          <div className="container">
            <div className="columns">
              <div className="column is-three-quarters">
                {Object
                  .entries(this.state.thisPageExportData)
                  .map(function (item, index) {
                    // 使用Object.entries的数据时`['1',[{对象}]]`的，于是在遍历完后留下`[{对象}]`。如果再map的话会触发react的bug,所以
                    // 用 字符串操作剔除首尾大括号，减少一层map绕开bug
                    var items = JSON.parse(JSON.stringify(item.slice(1)).substring(1, JSON.stringify(item.slice(1)).length - 1));
                    return (
                      <div key={index}>
                        <article className="media">
                          <div className="media-left"></div>
                          <div className="media-content">
                            <div className="content">
                              <h5>
                                <Link
                                  to={{
                                  pathname: '/post/' + items.slug + '/',
                                  state: {
                                    PostName: items.slug
                                  }
                                }}>{items.title}</Link>
                              </h5>
                              <p>
                                <small>{items
                                    .excerpt
                                    .substring(0, 300)}...
                                </small>
                                <br/>
                                <small>
                                  <Link
                                    to={{
                                    pathname: '/post/' + items.slug + '/',
                                    state: {
                                      PostName: items.slug
                                    }
                                  }}>阅读全文</Link>
                                </small>
                              </p>
                            </div>
                          </div>
                        </article>
                        <hr/>
                      </div>
                    )
                  })
}

                <nav
                  className="pagination is-centered"
                  role="navigation"
                  aria-label="pagination">
                  {this.state.articleIdLast
                    ? <Link
                        className="pagination-previous"
                        to={{
                        pathname: '/article/' + this.state.articleIdLast
                      }}
                        onClick={this.componentWillMount()}>上一页</Link>
                    : <a className="pagination-previous " disabled>没有了</a>}
                  {/* <Link className="pagination-previous" to="/article/1"  >第一页</Link> */}
                  {this.state.articleIdNext
                    ? <Link
                        className="pagination-next"
                        to={{
                        pathname: '/article/' + this.state.articleIdNext
                      }}
                        onClick={this.componentWillMount()}>下一页</Link>
                    : <a className="pagination-next " disabled>没有了</a>}
                  {/* <Link className="pagination-next"  to={{pathname:'/article/'+this.state.totalPage}} onClick={this.componentWillMount()}>最末页</Link> */}
                  <ul className="pagination-list">

                    <li>
                      <a
                        className="pagination-link is-current"
                        aria-label="Page 46"
                        aria-current="page">{this.state.articleId}</a>
                    </li>

                  </ul>
                </nav>
              </div>
              <SideBar/>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export class Indexs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ArticleData: this.props.posts,
      thisPageExportData: [],
      articleId: ''
    };
  }
  componentDidMount() {

    var articleId = 1;

    var SubArticle = 0
    for (var b in this.state.ArticleData) {
      if (this.state.ArticleData[b].title) {
        SubArticle = SubArticle + 1;
      }
    }

    var totalPage = Math.ceil(SubArticle / 5) //计算出总共页数
    var thisPageExportData;
    var thisPageExportitems = '';
    var PageArticle = Object.entries(this.state.ArticleData)

    for (var c = articleId * 5 - 1; c >= (articleId - 1) * 5; c--) {
      if (PageArticle[c]) {
        thisPageExportitems = JSON
          .stringify(PageArticle[c].slice(1))
          .substring(1, JSON.stringify(PageArticle[c].slice(1)).length - 1) + ',' + thisPageExportitems;
      }
    }
    thisPageExportitems = '[' + thisPageExportitems.substring(0, thisPageExportitems.length - 1) + ']'

    this.setState({
      thisPageExportData: JSON.parse(thisPageExportitems),
      articleId: articleId
    })
  }

  render() {
    return (
      <div>

        <section className="section">
          <div className="container">
            <div className="columns">
              <div className="column is-three-quarters">
                {Object
                  .entries(this.state.thisPageExportData)
                  .map(function (item, index) {
                    // 使用Object.entries的数据时`['1',[{对象}]]`的，于是在遍历完后留下`[{对象}]`。如果再map的话会触发react的bug,所以
                    // 用 字符串操作剔除首尾大括号，减少一层map绕开bug
                    var items = JSON.parse(JSON.stringify(item.slice(1)).substring(1, JSON.stringify(item.slice(1)).length - 1));
                    return (
                      <div key={index}>
                        <article className="media">
                          <div className="media-left"></div>
                          <div className="media-content">
                            <div className="content">
                              <h5>
                                <Link
                                  to={{
                                  pathname: '/post/' + items.slug + '/',
                                  state: {
                                    PostName: items.slug
                                  }
                                }}>{items.title}</Link>
                              </h5>
                              <p>
                                <small>{items
                                    .excerpt
                                    .substring(0, 300)}...
                                </small>
                                <br/>
                                <small>
                                  <Link
                                    to={{
                                    pathname: '/post/' + items.slug + '/',
                                    state: {
                                      PostName: items.slug
                                    }
                                  }}>阅读全文</Link>
                                </small>
                              </p>
                            </div>
                          </div>
                        </article>
                        <hr/>
                      </div>
                    )
                  })
}

                <nav
                  className="pagination is-centered"
                  role="navigation"
                  aria-label="pagination">
                  <a className="pagination-previous " disabled>没有了</a>

                  <Link className="pagination-next" to="/article/2">下一页</Link>

                  <ul className="pagination-list">

                    <li>
                      <a
                        className="pagination-link is-current"
                        aria-label="Page 46"
                        aria-current="page">1</a>
                    </li>

                  </ul>
                </nav>
              </div>
              <SideBar/>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

/**
 * 文章内页
 */

export class PostPage extends React.Component {
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
    var arrpath = pathName.split("/");

    for (var x in arrpath) {
      if (arrpath[x] != "post") {
        if (arrpath[x] != "") {
          if (arrpath[x] != "#") {
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
    async function fetchAsyncPostMarkdown() {
      let response = await fetch(`https://api.github.com/repos/${GITHUBNAME}/${GITHUBREPO}/contents/source/_posts/${path}.md?ref=master`);

      let data = await response.json();
      return data;
    }
    this.setState({
      PostURL: '/blog/#/post/' + postLink
    })

    fetchAsyncPostMarkdown().then(data => {
      this.setState({
        PostApiBackName: data.name,
        PostApiBackcContent: marked(b64_to_utf8(utf8_to_b64(b64_to_utf8(data.content))).replace(/---\ntitle:/g, '### ').replace(/date:/g, '\n##### '))
        //PostApiBackcContent: marked(data.content)
      });
    }).catch(reason => console.log(reason.message))

  }

  handleNewComment() {
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
                  <div
                    className="markdown-body"
                    dangerouslySetInnerHTML={{
                    __html: this.state.PostApiBackcContent
                  }}></div>
                  <hr/>

                  <ReactDisqusThread
                    shortname="github-sakura"
                    onNewComment={this.handleNewComment}/>
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

/**
 * 独立页面
 */
export class PagePage extends React.Component {
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
    var arrpath = pathNames.split("/");

    for (var x in arrpath) {
      if (arrpath[x] != "page") {
        if (arrpath[x] != "") {
          if (arrpath[x] != "#") {
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
    async function fetchAsyncPageMarkdown() {
      let response = await fetch(`https://api.github.com/repos/${GITHUBNAME}/${GITHUBREPO}/contents/source/${path}/index.md?ref=master`);

      let data = await response.json();
      return data;
    }
    this.setState({
      PostURL: '/#/Page/' + pageLink
    })

    fetchAsyncPageMarkdown().then(data => {
      this.setState({
        PageApiBackName: data.name,
        PageApiBackcContent: marked(b64_to_utf8(utf8_to_b64(b64_to_utf8(data.content))).replace(/---\ntitle:/g, '### ').replace(/date:/g, '\n##### '))
        //PostApiBackcContent: marked(data.content)
      });
    }).catch(reason => console.log(reason.message))

  }

  render() {
    return (
      <div>

        <section className="section">
          <div className="container">
            <div className="columns ">
              <div className="column is-three-quarters">
                <div className="box ">
                  <div
                    className="markdown-body"
                    dangerouslySetInnerHTML={{
                    __html: this.state.PageApiBackcContent
                  }}></div>
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

export class Donate extends React.Component {
  render() {
    return (
      <div>

        <section className="section">
          <div className="container">
            <div className="columns ">
              <div className="column is-three-quarters">
                <div className="box ">
                  <center>
                    <p>如果你想支持网站的发展的话，可以支付宝来给毓彦提供赞助</p>
                    <br/>
                    <figure className="image is-4by1">
                      <img
                        src="/static/alipay.png"
                        style={{
                        width: 240
                      }}/>
                    </figure>
                    <br/>
                    <p>OR 通过 Patreon 定期赞助</p>
                    <br/>
                    <a
                      className="button is-info is-outlined "
                      href="https://www.patreon.com/bePatron?c=1325706">:-D 每月赞助1$</a>
                  </center>
                </div>
              </div>
              <SideBar/>
            </div>

          </div>
        </section>
      </div>
    )
  }
}

/**
 * 文章内页
 */

export class ProjectPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ProjectApiBack: [],
      timeNow: ''
    };
  }
  componentDidMount() {
    /**
     * 异步请求抓取List
     */
    async function fetchAsyncPostMarkdown() {
      let response = await fetch(`https://api.github.com/users/${GITHUBNAME}/repos?sort=pushed`);

      let data = await response.json();
      return data;
    }

    var timeNow = moment().format();
    this.setState({timeNow: timeNow})

    fetchAsyncPostMarkdown().then(data => {
      this.setState({ProjectApiBack: data});
    }).catch(reason => console.log(reason.message))

  }

  render() {
    return (
      <div>

        <section className="section">
          <div className="container">
            <div className="columns">
              <div className="column is-three-quarters">
                <div >

                  {Object
                    .entries(this.state.ProjectApiBack)
                    .map(function (item, index) {
                      var items = JSON.parse(JSON.stringify(item.slice(1)).substring(1, JSON.stringify(item.slice(1)).length - 1));
                      return (
                        <div key={items.id}>
                          <article className="media">
                            <div className="media-left">
                              <figure className="image is-32x32"></figure>
                            </div>
                            <div className="media-content">
                              <div className="content">
                                <p>
                                  <a href={items.html_url}>
                                    <strong>{items.name}</strong>
                                  </a>
                                  <small>{items.fork
                                      ? <i className="fa fa-code-fork" aria-hidden="true"></i>
                                      : ''}</small>
                                  <br/>
                                  <small>Latest commit: {moment(items.pushed_at).from(moment().format())}</small>

                                  <br/> {items.description}
                                </p>
                              </div>
                              <nav className="level is-mobile">
                                <div className="level-left">
                                  <div className="field is-grouped is-grouped-multiline">
                                    <div className="control">
                                      <div className="tags has-addons">
                                        <span className="tag is-light">
                                          <i className="fa fa-star" aria-hidden="true"></i>Star</span>
                                        <span className="tag is-success">{items.stargazers_count}</span>
                                      </div>
                                    </div>

                                    <div className="control">

                                      <div className="tags has-addons">
                                        <span className="tag is-light">
                                          <i className="fa fa-code-fork" aria-hidden="true"></i>fork
                                        </span>
                                        <span className="tag is-success">{items.forks_count}</span>
                                      </div>
                                    </div>

                                    <div className="control">
                                      <a href={item.html_url + '/issues'}>
                                        <div className="tags has-addons">
                                          <span className="tag is-light">issues</span>
                                          <span className="tag is-success">{items.open_issues}</span>
                                        </div>
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </nav>
                            </div>
                          </article>
                          <hr/>
                        </div>
                      )
                    })}
                </div>
              </div >
              <SideBar/>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

/**
 * 路由配置
 * @param {*} props
 */

function RouterPage(props) {
  return (
    <div>
      <Router>
        <div>
          <Header/>
          <Switch>
            <Route exact path="/">
              <Indexs posts={props.data.posts}/>
            </Route>
            <Route path="/post/:postId" component={PostPage}/>
            <Route path="/page/:pageId" component={PagePage}/>
            <Route path="/article/:articleId">
              <ArticlePage posts={props.data.posts}/>
            </Route>
            <Route path="/archives">
              <Archives posts={props.data.posts}/>
            </Route>
            <Route path="/archives/:Aid">
              <Archives posts={props.data.posts}/>
            </Route>
            <Route path="/project/" component={ProjectPage}/>
            <Route path="/donate/" component={Donate}/>
            <Route path="/mobile/menu" component={MobileMenu}/>
            <Route path="/mobile" component={MobileMenu}/>
            <Route component={NoMatch}/>
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
function IndexPage(props) {
  return (
    <div>
      <RouterPage data={props.data}/>
      <Footer/>
    </div>
  )
}

fetch(`https://raw.githubusercontent.com/${GITHUBNAME}/${GITHUBREPO}/master/content.json?ref=master`)
  .then(function (data) {
    return data.json()
  })
  .then(function (json) {
    ReactDOM.render(
      <IndexPage data={json}/>, document.getElementById('app'));
  })
  .catch(function (e) {
    console.log(e);
  });