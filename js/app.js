const SUPABASE_URL = 'https://yyhvnheiuntuivgzucxx.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_UzvQvmDTe7AvQIjdNqbiuQ__VxgSaRu';

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

supabaseClient
    .from('services')
    .select('id, name, price')
    .eq('active', true)
    .then(({ data, error }) => {
        if (error) {
            console.error('Supabase connection test failed:', error.message);
        } else {
            console.log('Supabase connection successful!', data);
        }
    });

let selected={name:'',price:0};
let orders=JSON.parse(localStorage.getItem('dabw_orders')||'[]');

function chooseService(name,price){
 selected={name,price};
 openModal('order');
}
function openModal(type){
 const box=document.getElementById('modalbox');
 if(type==='order'){
 box.innerHTML=`<h2>${selected.name}</h2><p class="muted">Complete the request below.</p>
 <div class="row"><div class="field"><label>Full name</label><input id="fname" placeholder="Your name"></div><div class="field"><label>Mobile number</label><input id="phone" placeholder="+267 ..."></div></div>
 <div class="field"><label>Email</label><input id="email" type="email" placeholder="you@example.com"></div>
 <div class="field"><label>What do you need?</label><textarea id="details" placeholder="Tell us briefly what you need help with."></textarea></div>
 <div class="field"><label>Upload a document (optional prototype)</label><input id="file" type="file"></div>
 <div class="notice">Total: <strong>P${selected.price}</strong></div>
 <div class="actions"><button class="btn ghost" onclick="closeModal()">Cancel</button><button class="btn" onclick="simulatePayment()">Continue to payment</button></div>`;
 }
 if(type==='payment'){
 box.innerHTML=`<h2>Payment</h2><p class="muted">${selected.name}</p><div class="notice">Prototype payment screen — no real charge will be made.</div>
 <div class="card"><h3>Order total</h3><div class="price">P${selected.price}</div><p class="muted">Future production version will connect this step to a Botswana payment provider.</p></div>
 <div class="actions"><button class="btn ghost" onclick="closeModal()">Cancel</button><button class="btn" onclick="completeOrder()">Simulate successful payment</button></div>`;
 }
 if(type==='success'){
 const o=orders[orders.length-1];
 box.innerHTML=`<div style="text-align:center"><div style="font-size:52px">🎉</div><h2>Payment Successful!</h2><p>Your request has been received.</p><div class="notice success"><strong>Order #${o.id}</strong><br>${o.service} — P${o.amount}<br>Status: PAID / PROCESSING</div><button class="btn" onclick="closeModal();showDashboard()">View my order</button></div>`;
 }
 if(type==='login'){
 box.innerHTML=`<h2>Customer Login</h2><p class="muted">This prototype uses a demo account — full authentication comes in the next build.</p><div class="field"><label>Email</label><input value="demo@digitalassistbw.co.bw"></div><div class="field"><label>Password</label><input type="password" value="demo1234"></div><div class="actions"><button class="btn ghost" onclick="closeModal()">Cancel</button><button class="btn" onclick="closeModal();showDashboard()">Login to demo</button></div>`;
 }
 if(type==='how'){
 box.innerHTML=`<h2>How Digital Assist BW works</h2><p>1. Choose a service.</p><p>2. Submit your request.</p><p>3. Pay securely.</p><p>4. We process your request.</p><p>5. Track the status and receive your completed work.</p><div class="actions"><button class="btn" onclick="closeModal()">Got it</button></div>`;
 }
 document.getElementById('modal').classList.add('show');
}
function closeModal(){document.getElementById('modal').classList.remove('show')}
function simulatePayment(){openModal('payment')}
function completeOrder(){
 const id='DA'+String(orders.length+1).padStart(5,'0');
 orders.push({id,service:selected.name,amount:selected.price,status:'Processing',date:new Date().toLocaleDateString()});
 localStorage.setItem('dabw_orders',JSON.stringify(orders));
 openModal('success');
}
function showHome(){document.getElementById('home').classList.add('active');document.getElementById('dashboard').classList.remove('active');window.scrollTo({top:0,behavior:'smooth'})}
function showDashboard(){
 document.getElementById('home').classList.remove('active');document.getElementById('dashboard').classList.add('active');
 const box=document.getElementById('orders');
 if(!orders.length){box.innerHTML='<div class="card"><h3>No orders yet</h3><p class="muted">Choose a service to create your first order.</p><button class="btn" onclick="showHome()">Browse services</button></div>';return}
 box.innerHTML='<div class="card" style="padding:0;overflow:auto"><table><thead><tr><th>Order</th><th>Service</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead><tbody>'+orders.map(o=>`<tr><td><strong>${o.id}</strong></td><td>${o.service}</td><td>P${o.amount}</td><td><span class="status processing">${o.status}</span></td><td>${o.date}</td></tr>`).join('')+'</tbody></table></div>';
}
