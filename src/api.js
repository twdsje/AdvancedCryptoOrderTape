function subscribeToTimer(cb, instrument) {
  console.log('Opening socket');
  const socket = new WebSocket('wss://ws-feed.gdax.com');
  
  socket.addEventListener('open', function(event) {
	console.log(`Subscribing to ${instrument}`);
	
	
	var subscribe = `{"type": "subscribe", "channels": [{"name": "matches", "product_ids": ["${instrument}"]}]}`;
	socket.send(subscribe);
  console.log('Receiving data');
	socket.addEventListener('close', function(event) {
	  console.log('Client disconnected.');
    });    
  });
  
  //socket.addEventListener('message', function(event) {
  //  console.log('new message', event.data);
  //});
  
  socket.addEventListener('message', timestamp => cb(null, timestamp));
  
  
  
  return () => {socket.close();}
}
export { subscribeToTimer };