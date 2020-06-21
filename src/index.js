import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//保存しようとしている項目が現在のリストに存在するときtrueを返す
function samelist(a,...array){
  for (let i = 0; i < array.length; i++) {
    if(array[i]===a){
      return true;
    }
  }
}

class Table extends React.Component{
  constructor(props){
    super(props);
    this.state={
      lists: [],
      typinglist: '',
      edit: false,
      editnumber: 0,
      donelists: [],
      hyouji: false,
      finish: false,
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteClick = this.deleteClick.bind(this);
    this.editClick = this.editClick.bind(this);
    this.hyoujiClick = this.hyoujiClick.bind(this);
    this.doneClick = this.doneClick.bind(this);
  }

  handleSubmit(event){
    const newlist=this.state.typinglist;
    const lists=this.state.lists;
    if (newlist){
      if (this.state.edit) {
        if (lists[this.state.editnumber]===newlist) {
          alert('編集項目が変更されていません');
        }else if(samelist(newlist,...lists)){
          alert('同名の項目が存在します');
        }else{
          lists.splice(this.state.editnumber,1,newlist);
          this.setState({
            lists: lists,
            typinglist: '',
            edit: false,
            editnumber: 0,
          })
        }
      }else{
        if(samelist(newlist,...lists)){
          alert('同名の項目が存在します');
        }else{
          this.setState({
            lists: lists.concat([newlist]),
            typinglist: '',
            edit: false,
            editnumber: 0,
          });
        }
      }
    }else{
      alert('やることを入力してください');
    }
  }

  handleChange(event){
      this.setState({
        typinglist: event.target.value,
      })
  }

  editClick(list,number){
    this.setState({
      typinglist: list,
      edit: true,
      editnumber: number,
    })
  }

  deleteClick(i){
    let lists=this.state.lists;
    lists.splice(i,1);
    this.setState({
      lists: lists
    })
  }

  hyoujiClick(){
    if (this.state.donelists.length) {
      this.setState({
        hyouji: !this.state.hyouji,
      })
    }else{
      this.setState({
        hyouji: false,
      })
    }

  }

  doneClick(list,number){
    let lists=this.state.lists;
    lists.splice(number,1);
    let donelists=this.state.donelists;
    if (this.state.donelists.length===4) {
      this.setState({
        finish: true,
      })
    }
    this.setState({
      lists: lists,
      donelists: donelists.concat([list]),
      hyouji: true,
    })
  }

  render(){
    const lists=this.state.lists.map((list,number)=>{
      return(
          <li key={number}>
            <nobr onClick={()=>this.editClick(list,number)}>
              {list}
            </nobr>
            <button className='delete' onClick={()=>this.doneClick(list,number)}>
              完了
            </button>
            <button className='delete' onClick={()=>this.deleteClick(number)}>
              削除
            </button>
          </li>
        )
    });

    const donelists=this.state.donelists.map((list,number)=>{
      if (this.state.hyouji) {
        return(
            <li key={number}>
                {list}
            </li>
          )
      }
      return null;
    });

    return(
      <div className="table">
        <h1>Todoリスト作成</h1>
          <div className="form">
            <Form
              onSubmit={this.handleSubmit}
              onChange={this.handleChange}
              newlist={this.state.typinglist}
            />
          </div>
          <div className="list">
            <ul>{lists}</ul>
          </div>
          <div>
            <Done
              isDonelist={!!this.state.donelists.legth}
              hyouji={this.state.hyouji}
              onClick={()=>this.hyoujiClick()}
              donelists={donelists}
            />
          </div>
      </div>
    );
  }
}

class Done extends React.Component{
  render(){
    let hyouji= this.props.hyouji? '表示しているよ':'表示ボタン';
    return(
      <div className="sidebar">
        <button onClick={()=>this.props.onClick()}>
          {hyouji}
        </button>
        {this.props.donelists}
      </div>
    )
  }
}

class Form extends React.Component{
  render(){
    return(
        <form>
            <input className='box' type="text"
              value={this.props.newlist} onChange={this.props.onChange}
            />
            <input className='btn' type="button" value='保存' onClick={this.props.onSubmit}/>
        </form>
    );
  }
}

ReactDOM.render(
    <Table />,
  document.getElementById('root')
);
