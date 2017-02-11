document.addEventListener("DOMContentLoaded", function(event) {
  window.firstDate = new Date();
  window.thisLocation = location.hash.replace(/[^\w\s]/gi, '') || 'homepage';
  var postTimeDifference = function(firstDate, domain, location) {
    let postData = {
      domain: domain,
      timeDifference: Math.abs(new Date() - window.firstDate),
      location: window.thisLocation,
      date: window.firstDate
    };
    request.open("POST", pageTimeEndpoint, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('Access-Control-Allow-Origin', '*');
    request.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    request.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    request.send(JSON.stringify(postData));
    window.firstDate = new Date();
  }
  window.onbeforeunload = function() {
    postTimeDifference(window.firstDate, location.hostname, window.thisLocation);
  }
  document.onbeforeunload = window.onbeforeunload;
  document.focus = window.focus;
  // if (!sessionStorage.sessionId) {
  //   $.ajax({
  //     type: 'GET',
  //     url: 'http://localhost:3000/session',
  //     success: function(data) {
  //       sessionStorage.setItem('location', locationNoHash);
  //       sessionStorage.setItem('sessionId', data);
  //       sessionStorage.setItem('dateStart', new Date());
  //       console.log('hello', typeof sessionStorage.dateStart)
  //       console.log(sessionStorage);
  //     }
  //   });
  // }
  // console.log('DOCUMENT READY TO PARSE!', 'DATA READY TO TRACK AND SEND!');

  //configuration (move to object eventually)

  //sends events by type and to endpoint
  var wokeSharkMetrics = {},
    event, request, eventType;

  //set wokeShark Session

  sessionStorage.setItem("wokeSharkSession", true);

  //add endpoints here

  const linkClickEndpoint = "http://127.0.0.1:8080/linkClick";
  const pageViewEndpoint = "http://127.0.0.1:8080/pageView";
  const pageTimeEndpoint = "http://127.0.0.1:8080/pagetime"


  //Generic Tracking Mechanism

  wokeSharkMetrics.report = function(eventData, eventType, endpoint, metaData) {
    event = {};
    event[eventType] = eventData;
    console.log('EVENT BEING SENT TO ENDPOINT', event, endpoint);
    request = new XMLHttpRequest();
    request.open("POST", endpoint, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('Access-Control-Allow-Origin', '*');
    request.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    request.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    request.send(JSON.stringify(event));
  };

  //click events

  document.body.onclick = function(event) {
    event = event || window.event;
    var target = event.target || event.srcElement;

    // console.log('event target', event.target);
    // console.log('event target inner text', event.target.text);
    if (event.target.text) {
      //event type = url, eventData = "Add to card"
      //how to pass product name back to server?
      wokeSharkMetrics.report(event.target.text, "url", linkClickEndpoint);
    }
  };

  //hash change events

  if ("onhashchange" in window) {
    function currentHash() {
      console.log('hash change HERE')
      // console.log('location hash', location.hash);
      if (!location.hash) {
        //event type = title , eventData = "Buyify"
        wokeSharkMetrics.report(document.title, "title", pageViewEndpoint);
      } else {
        var locationNoHash = location.hash.replace(/[^\w\s]/gi, '');
        // console.log('locationNoHash', locationNoHash);
        wokeSharkMetrics.report(locationNoHash, "title", pageViewEndpoint);
        //code to get time on page
        // var postData = {
        //   timeSpent: Math.abs(new Date() - sessionStorage.dateStart),
        //   location: sessionStorage.location
        // };
        // console.log('post data here', postData)
      }
      postTimeDifference(window.firstDate, location.hostname, window.thisLocation);
      window.thisLocation = location.hash.replace(/[^\w\s]/gi, '') || 'homepage';
      // console.log('host name ', location.hostname)
      // console.log('hello', typeof firstDate)
      // var postData = {
      //   domain: location.hostname,
      //   timeDifference: Math.abs(new Date() - firstDate),
      //   location: window.thisLocation,
      //   date: firstDate
      // }
      // firstDate = new Date();
      // window.thisLocation = location.hash.replace(/[^\w\s]/gi, '') || 'homepage';
      // request.open("POST", pageTimeEndpoint, true);
      // request.setRequestHeader('Content-Type', 'application/json');
      // request.setRequestHeader('Access-Control-Allow-Origin', '*');
      // request.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      // request.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
      // request.send(JSON.stringify(postData));

    }
  }


  //listen for hash change events
  window.onhashchange = currentHash;

  //send initial pageview data on load
  wokeSharkMetrics.report(document.title, "title", pageViewEndpoint);
});
