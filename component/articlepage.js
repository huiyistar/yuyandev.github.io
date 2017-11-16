import React from 'react';
import SideBar from './sidebar';

const GITHUBNAME =`YuYanDev`
const GITHUBREPO =`YuYanDev.github.io`

export default class ArticlePage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      ArticleData :this.props.posts,
      thisPageExportData:[],
      articleId:'',
      totalPage:'',
      articleIdLast:'',
      articleIdNext:''
    };
  }
  componentDidMount(){
    
    var arrpath=window.location.hash.split("/");
    var articleId;
    for(var x in arrpath){
      if(arrpath[x]!="article"){
        if(arrpath[x]!=""){
          if(arrpath[x]!="#"){
            articleId = arrpath[x];
          }
        }
      }
    }
    
    var SubArticle=0
    for(var b in this.state.ArticleData){
       if(this.state.ArticleData[b].title){
        SubArticle =SubArticle+1;
       }  
    } 
    
    var totalPage = Math.ceil(SubArticle/5) //计算出总共页数
    var thisPageExportData;
    var thisPageExportitems='';
    var PageArticle = Object.entries(this.state.ArticleData)
    
    for(var c = articleId*5-1;c>=(articleId-1)*5;c--){ 
      if(PageArticle[c]){
        thisPageExportitems = JSON.stringify(PageArticle[c].slice(1)).substring(1,JSON.stringify(PageArticle[c].slice(1)).length-1)+','+thisPageExportitems;
      }
    }
    thisPageExportitems='['+thisPageExportitems.substring(0,thisPageExportitems.length-1)+']'

    var articleIdNext
    if(articleId==totalPage){
      articleIdNext:false
    }else{
      articleIdNext = parseInt(articleId)+1
    }

    var articleIdLast
    if(articleId==1){
      articleIdLast:false
    }else{
      articleIdLast = parseInt(articleId)-1
    }

    this.setState({
      thisPageExportData:JSON.parse(thisPageExportitems),
      articleId:articleId,
      totalPage:totalPage,
      articleIdNext:articleIdNext,
      articleIdLast:articleIdLast
    })
  }
  
  componentWillMount(){
    // componentDidUpdate() {
    var arrpath=window.location.hash.split("/");
    var articleId;
    for(var x in arrpath){
      if(arrpath[x]!="article"){
        if(arrpath[x]!=""){
          if(arrpath[x]!="#"){
            articleId = arrpath[x];
          }
        }
      }
    }
    if(articleId!=this.state.articleId){
      window.scrollTo(0, 0)
      clearInterval(this.state.articleId)
      clearInterval(this.state.thisPageExportData)

      var SubArticle=0
      for(var b in this.state.ArticleData){
        if(this.state.ArticleData[b].title){
          SubArticle =SubArticle+1;
        }  
      } 

      var totalPage = Math.ceil(SubArticle/5) //计算出总共页数
      var thisPageExportData;
      var thisPageExportitems='';
      var PageArticle = Object.entries(this.state.ArticleData)

      for(var c = articleId*5-1;c>=(articleId-1)*5;c--){
        if(PageArticle[c]){
          thisPageExportitems = JSON.stringify(PageArticle[c].slice(1)).substring(1,JSON.stringify(PageArticle[c].slice(1)).length-1)+','+thisPageExportitems;      
        }
      }
      thisPageExportitems='['+thisPageExportitems.substring(0,thisPageExportitems.length-1)+']'

      var articleIdNext
      if(articleId==totalPage){
        articleIdNext:false
      }else{
        articleIdNext = parseInt(articleId)+1
      }
  
      var articleIdLast
      if(articleId==1){
        articleIdLast:false
      }else{
        articleIdLast = parseInt(articleId)-1
      }
      
      this.setState({
        thisPageExportData:JSON.parse(thisPageExportitems),
        articleId:articleId,
        articleIdLast:articleIdLast,
        articleIdNext:articleIdNext
      })
    }
  }

  render(){
    return(
      <div>
      
      <section className="section">
        <div className="container">
          <div className="columns">
            <div className="column is-three-quarters">   
              { Object.entries(this.state.thisPageExportData).map(function(item,index){
                //使用Object.entries的数据时`['1',[{对象}]]`的，于是在遍历完后留下`[{对象}]`。如果再map的话会触发react的bug,所以用字符串操作剔除首尾大括号，减少一层map绕开bug
                  var items = JSON.parse(JSON.stringify(item.slice(1)).substring(1,JSON.stringify(item.slice(1)).length-1));
                    return(
                      <div key={index}>
                        <article className="media">
                          <div className="media-left">
                          
                          </div>
                          <div className="media-content">
                            <div className="content">                              
                              <h5><Link to={{pathname:'/post/'+items.slug+'/',state:{PostName:items.slug} }}>{items.title}</Link> </h5>                              
                              <p>
                                <small>{items.excerpt.substring(0,200)}... </small>
                                <br/>
                                <small><Link to={{pathname:'/post/'+items.slug+'/',state:{PostName:items.slug} }}>阅读全文</Link></small>
                              </p>
                            </div>
                          </div>
                        </article> 
                        <hr/>                   
                      </div>
                    )         
                }) 
              }

              <nav className="pagination is-centered" role="navigation" aria-label="pagination">
                {this.state.articleIdLast?<Link className="pagination-previous" to={{pathname:'/article/'+this.state.articleIdLast}} onClick={this.componentWillMount()}>上一页</Link>:<a className="pagination-previous" >没有了</a>}
                {/* <Link className="pagination-previous" to="/article/1"  >第一页</Link> */}
                {this.state.articleIdNext?<Link className="pagination-next"  to={{pathname:'/article/'+this.state.articleIdNext}} onClick={this.componentWillMount()}>下一页</Link>:<a className="pagination-next" >没有了</a>}
                {/* <Link className="pagination-next"  to={{pathname:'/article/'+this.state.totalPage}} onClick={this.componentWillMount()}>最末页</Link> */}
                <ul className="pagination-list">
                  
                  
                  <li><a className="pagination-link is-current" aria-label="Page 46" aria-current="page">{this.state.articleId}</a></li>
                  
                  
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
