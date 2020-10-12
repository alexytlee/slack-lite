// client-side
const socket = io('http://localhost:9000'); // the / namespace/endpoint
let nsSocket = '';
// listen for nsList, which is a list of all namespaces
socket.on('nsList', (nsData) => {
  console.log('the list of namespaces has arrived');
  // console.log(nsData);
  let namespacesDiv = document.querySelector('.namespaces');
  namespacesDiv.innerHTML = '';
  nsData.forEach((ns) => {
    namespacesDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint}><img src="${ns.img}" /></div>`;
  });

  // add a clicklistener for each namespace
  Array.from(document.getElementsByClassName('namespace')).forEach((elem) => {
    // console.log(elem);
    elem.addEventListener('click', (e) => {
      // console.dir(e.target);
      const nsEndpoint = elem.getAttribute('ns');
      // console.log(`${nsEndpoint} that i should go to now`);
      joinNs(nsEndpoint);
    });
  });
  joinNs('wiki');
});
