import React from 'react';
import ReactDOM from 'react-dom';

const GITHUBNAME =`YuYanDev`
const GITHUBREPO =`YuYanDev.github.io`

export default class Footer extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      Hitokoto: '',
      HitokotoCatname:''
    };
  }
  componentDidMount() {
    function randomNum(minNum,maxNum){ 
      switch(arguments.length){ 
        case 1: 
          return parseInt(Math.random()*minNum+1,10); 
          break; 
        case 2: 
          return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
          break; 
        default: 
          return 0; 
          break; 
      } 
    }
    async function fetchAsyncPostMarkdown () {
      let response = await fetch(`https://raw.githubusercontent.com/${GITHUBNAME}/${GITHUBREPO}/master/hitokoto.json`);  
      let data = await response.json();
      return data;
    }    
    fetchAsyncPostMarkdown()
    .then(data => {
      var SubHitokoto=0
      for(var b in data){
         if(data[b].id){
          SubHitokoto =SubHitokoto+1;
         }  
      }
      var HtokotoId = randomNum(0,SubHitokoto);
      this.setState({
        Hitokoto: unescape(data[HtokotoId].hitokoto.replace(/\\u/g, '%u')),
        HitokotoCatname:unescape(data[HtokotoId].catname.replace(/\\u/g, '%u')),
      });
    }).catch(reason => console.log(reason.message))
  }
  render (){
    return(
      <div>
        <footer className="footer">
          <div className="container">
            <div className="columns is-centered">
              <div className="column is-three-quarters">
                <div className="columns ">
                  <div className="column is-three-quarters">
                    <div className="content ">
                      <div>
                      
                      </div>
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