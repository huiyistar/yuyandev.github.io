import React from 'react';
import SideBar from './sidebar';

const GITHUBNAME =`YuYanDev`
const GITHUBREPO =`YuYanDev.github.io`

export default class ProjectPage extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      ProjectApiBack: []
    };
  }
  componentDidMount() {
    /**
     * 异步请求抓取List
     */
    async function fetchAsyncPostMarkdown () {
      let response = await fetch(`https://api.github.com/users/${GITHUBNAME}/repos`);
      
      let data = await response.json();
      return data;
    }
    
    
    fetchAsyncPostMarkdown()
    .then(data => {this.setState({
      ProjectApiBack: data
    });})
    .catch(reason => console.log(reason.message))

  }


  render() {
    return (
      <div>
        
        <section className="section">
          <div className="container">
            <div className="columns">
              <div className="column is-three-quarters"> 
                <div className="box">
                  {this.state.ProjectApiBack.map(function(item){
                    return (
                      <div className="box " key={item.id}>
                        <article className="media">
                          <div className="media-left">
                          <figure className="image is-32x32">
                            
                          </figure>
                          </div>
                          <div className="media-content">
                            <div className="content">
                              <p>
                                <a href={item.html_url}><strong>{item.name}</strong></a>  <small>{item.fork?<i className="fa fa-code-fork" aria-hidden="true"></i>:''}</small>
                                <br/>
                                <small>Latest commit: {item.updated_at.replace(/T/g,' ').replace(/Z/g,'')}</small>
                                
                                <br/>
                                {item.description}
                              </p>
                            </div>
                            <nav className="level is-mobile">
                              <div className="level-left">
                                <div className="field is-grouped is-grouped-multiline">
                                  <div className="control">
                                      <div className="tags has-addons">
                                        <span className="tag is-light"><i className="fa fa-star" aria-hidden="true"></i>Star</span>
                                        <span className="tag is-success">{item.stargazers_count}</span>
                                      </div>
                                  </div>
                              
                                  <div className="control">

                                      <div className="tags has-addons">
                                        <span className="tag is-light"><i className="fa fa-code-fork" aria-hidden="true"></i>fork </span>
                                        <span className="tag is-success">{item.forks_count}</span>
                                      </div>
                                  </div>
                              
                                  <div className="control">
                                    <a href={item.html_url+'/issues'}>
                                      <div className="tags has-addons">
                                        <span className="tag is-light">issues</span>
                                        <span className="tag is-success">{item.open_issues}</span>
                                      </div>
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </nav>
                          </div>
                        </article>
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