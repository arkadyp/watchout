var a = $('.lyrics').find('a')
var lines = "";
for( var i = 0 ; i < a.length ; i++ ){
  lines += a[i].text+" ";
}


var song = 'This is a public service announcement brought to you in part by Slim Shady The views and events expressed here are totally fucked And are not necessarily the views of anyone However, the events and suggestions that appear on this album Are not to be taken lightly Children should not partake in the listening of this album With laces in their shoes Slim Shady is not responsible for your actions. Upon purchasing this album, You have agreed not to try this at home. (a-anything else?)'

var words = song.split(' ');