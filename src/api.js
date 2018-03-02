function subscribeToTimer(cb) {
  console.log('Opening socket');
  const socket = new WebSocket('wss://ws-feed.gdax.com');
  
  socket.addEventListener('open', function(event) {
	console.log('Subscribing');
	
	
	var subscribe = '{"type": "subscribe", "channels": [{"name": "matches", "product_ids": ["BTC-USD"]}]}';
	socket.send(subscribe);

	socket.addEventListener('close', function(event) {
	  console.log('Client disconnected.');
    });    
  });
  
  //socket.addEventListener('message', function(event) {
  //  console.log('new message', event.data);
  //});
  
  socket.addEventListener('message', timestamp => cb(null, timestamp));
}
export { subscribeToTimer };