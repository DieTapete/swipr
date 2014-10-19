#swipr

swipr is a jquery plugin that creates one of those wonderful slideshows/galleries that can be found all over the internet.
it's focused on performance and mobile friendliness.

##Philosophy
swipr has a module based approach. it starts out with a barebone gallery that can only be used via swipe gestures or scrolling.
but modules like a paginator or visual buttons can be added if needed.

##Examples
See example.html for a full working example.

##Installation
	bower install swipr

##Methods
- goto
- gotoNext
- gotoPrev

- moveTo
- moveToNext
- moveToPrev

##Events
- beforeMove
  Parameters: index - index of the current slide before moving
- afterMove 
  Parameters: index - index of the new slide after moving

##Credits
swipr was created by Henner Woehler 
www.henner-woehler.de