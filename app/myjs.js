class App extends React.Component {
	render(){
		return (
			<div>
				<Nabvar />
				<Grid />
                <Footer />
			</div>
		);		
	}
}

class Grid extends React.Component{
	render(){
		return(
			<Trivial />
		);
	}
}

class Nabvar extends React.Component {
    constructor(props) {
	    super(props);
	    this.state = ({});
    }

	render(){
		return(
            <div>
                <div className="ui top attached menu">
                    <div className="right menu">
                        <a className="item" id="btn-menu">
                            <i className="sidebar icon"></i>
                            Menu
                        </a>
                    </div>
                </div>
                <div className="ui top icon inline sidebar inverted vertical menu">
                    <a className="item" id="menuOptionTrivial">
                      <i className="gamepad icon"></i>
                      Trivial
                    </a>
                    <a className="item">
                      <i className="question icon"></i>
                      Coming soon . . .
                    </a>
                    <a className="item">
                      <i className="question icon"></i>
                      Coming soon . . .
                    </a>
                </div>
            </div>
		);
	}
}

class Footer extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div className="ui inverted vertical footer segment margin-top-3">
                <div className="ui container">
                  <div className="ui stackable inverted divided equal height stackable grid">
                    <div className="three wide column">
                      <h4 className="ui inverted header">About</h4>
                      <div className="ui inverted link list">
                        <a href="#" className="item">Sitemap</a>
                        <a href="#" className="item">Contact Us</a>
                        <a href="#" className="item">Religious Ceremonies</a>
                        <a href="#" className="item">Gazebo Plans</a>
                      </div>
                    </div>
                    <div className="three wide column">
                      <h4 className="ui inverted header">Services</h4>
                      <div className="ui inverted link list">
                        <a href="#" className="item">Banana Pre-Order</a>
                        <a href="#" className="item">DNA FAQ</a>
                        <a href="#" className="item">How To Access</a>
                        <a href="#" className="item">Favorite X-Men</a>
                      </div>
                    </div>
                    <div className="seven wide column">
                      <h4 className="ui inverted header">Footer Header</h4>
                      <p>Extra space for a call to action inside the footer that could help re-engage users.</p>
                    </div>
                  </div>
                </div>
            </div>
        );
    }
}

class Trivial extends React.Component{
    constructor(props) {
	    super(props);
	    this.state = ({
	    	data: {}, cards: []
	    });
	    this.baseURL = 'https://opentdb.com/api.php?amount=10';
    }
	
    componentWillMount(){
    	fetch(this.baseURL)
			.then(response => response.json())
			.then(data => this.processResult(data))
    } 

	processResult(data) {
        let cardArray = this.state.cards;
        data.results.forEach(element => {
            const myCard = new Card(element);    
            cardArray = [...cardArray, myCard];
        });  
        this.setState({ data: data, cards: cardArray });
	}

	handleClick(){
    	fetch(this.baseURL)
			.then(response => response.json())
			.then(data => this.processResult(data))
	}

    shouldComponentUpdate(nextProps, nextState){return true;}

	render() {
        const cards = this.state.cards.map((card, i) =>
        <TrivialCard card={card} key={i}></TrivialCard>
        )
        return (
            <div className="ui stackable grid container">
                <div className="row">
                    {cards}
                </div>
                <div className="centered row margin-top-1">
                    <div className="ui statistics">
                      <div className="green statistic">
                        <div className="value" id="aciertosScore">
                          0
                        </div>
                        <div className="label">
                          <i className="large green thumbs up icon"></i>Aciertos
                        </div>
                      </div>
                      <div className="red statistic">
                        <div className="value" id="fallosScore">
                          0
                        </div>
                        <div className="label">
                          <i className="large red thumbs down icon"></i>Fallos
                        </div>
                      </div>
                    </div>
                </div>
                <div className="centered row">
                    <button className="ui inverted green button" onClick={()=>this.handleClick()}><i className="plus icon"></i> Añadir 10 preguntas más</button>
                </div>
            </div>
        );
	}
}

class Card {
    question = '';
    correctAnswer = '';
    answers = [];
    category = '';
    difficulty = '';
    type = '';
    responded = false;
    rightAnswered = false;
    indexResponse = -1;

    constructor(json){
        this.question = json.question;
        this.correctAnswer = json.correct_answer;
        this.answers = json.incorrect_answers;
        this.answers = [...this.answers, json.correct_answer];
        this.category = json.category;
        this.difficulty = json.difficulty;
        this.type = json.type;

        this.suffle();
    }

    suffle(){
        this.answers = this.answers.sort(function() {
          return .5 - Math.random();
        });
    }

}

class TrivialCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {myCard: this.props.card};
    }

    componentWillReceiveProps(nextProps) {
        this.myCard = nextProps;
    }

    shouldComponentUpdate(nextProps, nextState) {return true;}

    handleClick(index){
        let card = this.state.myCard;
        card.responded = true;
        card.indexResponse = index;
        if(card.answers[index] === card.correctAnswer){
        	card.rightAnswered = true;
            document.getElementById('aciertosScore').innerHTML = parseInt(document.getElementById('aciertosScore').innerHTML,10) + 1;
        }else{
            document.getElementById('fallosScore').innerHTML = parseInt(document.getElementById('fallosScore').innerHTML,10) + 1;
        }
        this.setState({myCard: card});
    }

    selectClass(index){
    	if(this.state.myCard.indexResponse === index && !this.state.myCard.rightAnswered){
            return "fluid ui red button";    
        } else if(this.state.myCard.answers[index] === this.state.myCard.correctAnswer){
            return "fluid ui green button";    
        }else {
            return "fluid ui grey button";
		}
    }

    render() {
        let answers = <div></div>;
        if(this.props.card.responded === false){
            answers = this.props.card.answers.map((answer,i)=>
            <button type="button" className="fluid teal ui button" key={i} onClick={()=>this.handleClick(i)} 
                dangerouslySetInnerHTML={{__html: answer}}></button>
            );    
        }else {
            answers = this.props.card.answers.map((answer,i)=>
            <button type="button" className={this.selectClass(i)} key={i} disabled 
                dangerouslySetInnerHTML={{__html: answer}}></button>
            );
        }
        return (
            <div className="four wide column">
                <div className="ui card">
                    <div className="content">
                        <h2 className="header" dangerouslySetInnerHTML={{__html: this.props.card.question}}></h2>
                    </div>
                    <div className="description margin-top-1">
                        {answers}
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);

/*JS para Semantic, menu, modales y ratings*/
$( "#btn-menu" ).click(function() {
    $('.ui.sidebar').sidebar('setting', 'transition', 'scale down')
    $('.ui.sidebar').sidebar('toggle');
});

$( "#menuOptionTrivial" ).click(function() {
    $('.ui.sidebar').sidebar('toggle');
});

$( "#btn-modal" ).click(function() {
    $('.ui.modal')
       .modal('setting', 'transition', 'horizontal flip')
      //.modal('setting', 'transition', 'scale')
      .modal('show')
    ;
});

$('.rating')
  .rating({
    initialRating: 2,
    maxRating: 10
  });