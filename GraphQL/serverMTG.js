var express = require('express');
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');
const fs = require('fs');

// GraphQL schema
var schema = buildSchema(`
    type Query {
        card(id: String): Card
        cards(manaCost: String, rarity: String, number: Int, cmc: Int, types: String, supertypes: [String] colors: [String]): [Card]
    },
    type Mutation {
        updateCardText(id: String!, text: String!): Card
    },
    type Card {
        id: String!
        artist: String
        colorIdentity: [String]
        colors: [String]
        manaCost: String
        cmc: Int
        number: Int!
        name: String!
        power: String
        toughness: String
        rarity: String!
        type: String
        supertypes: [String]
        types: [String]
        subtypes: [String]
        text: String
    }
`);


var setData = JSON.parse(fs.readFileSync('BBD.json'));

var getCard = function(args) {
    var id = args.id;
    return setData["cards"].filter(card => {
        return card.id == id;
    })[0];
}

var getCards = function(args) {
    var resultData = setData["cards"];
    if(args.manaCost || args.cmc || args.number || args.rarity || args.supertypes || args.types || args.colors){
        if (args.manaCost) {
            var manaCost = args.manaCost;
            resultData = resultData.filter(card => card.manaCost === manaCost);
        }
        if (args.cmc) {
            var cmc = args.cmc;
            resultData = resultData.filter(card => card.cmc === cmc);
        }
        if (args.number) {
            var number = args.number;
            resultData = resultData.filter(card => card.number === number);
        }
        if (args.rarity) {
            var rarity = args.rarity;
            resultData = resultData.filter(card => card.rarity === rarity);
        }
		if (args.supertypes) {
			var supertypes = args.supertypes;
			for(var i = 0; i < supertypes.length; i++){
				resultData = resultData.filter(card => checkSupertypes(card, supertypes[i]));
			}
		}
        if (args.types) {
            var types = args.types;
            resultData = resultData.filter(card => card.types.indexOf(types) >= 0);
        }
		if (args.colors) {
			var colors = args.colors;
			for(var i = 0; i < colors.length; i++){
				resultData = resultData.filter(card => checkColors(card, colors[i]));
			}
		}
    }

    return resultData;
}

var updateCardText = function({id, text}) {
    setData["cards"].map(card => {
        if (card.id === id) {
            card.text = text;
            return card;
        }
    });
    return setData["cards"].filter(card => card.id === id) [0];
}

var root = {
    card: getCard,
    cards : getCards,
     updateCardText: updateCardText
};

// Create an express server and a GraphQL endpoint
var app = express();
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(process.env.PORT || 4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));


function checkColors(card, color){
	if(card.hasOwnProperty("colors")){
		return card.colors.indexOf(color) >= 0;
	} else {
		return false;
	}
}

function checkSupertypes(card, supertype){
	if(card.hasOwnProperty("supertypes")){
		return card.supertypes.indexOf(supertype) >= 0;
	} else {
		return false;
	}
}
