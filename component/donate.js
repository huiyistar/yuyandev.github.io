import React from 'react';
import SideBar from './sidebar';

const GITHUBNAME =`YuYanDev`
const GITHUBREPO =`YuYanDev.github.io`

export default class Donate extends React.Component{
  render(){
    return(
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
                    <img src="/static/alipay.png" style={{width:240}}/>
                    </figure>
                    <br/>
                    <p>OR 通过 Patreon 定期赞助</p>
                    <br/>
                    <a className="button is-info is-outlined " href="https://www.patreon.com/bePatron?c=1325706">:-D 每月赞助1$</a>
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