// Saff Safaii Pune front-end. Database integration instructions are in SETUP.md.
const PACKAGES = {
  '1 BHK': { base: 4000, wallMin: 5500, wallMax: 6000 },
  '2 BHK': { base: 4500, wallMin: 7500, wallMax: 7500 },
  '3 BHK': { base: 6000, wallMin: 9000, wallMax: 9000 },
  '4 BHK': { base: 8000, wallMin: 12000, wallMax: 12000 }
};
const inr = n => '₹' + n.toLocaleString('en-IN');
const priceGrid = document.getElementById('priceGrid');
Object.entries(PACKAGES).forEach(([bhk,p],i)=>{
  const card=document.createElement('article'); card.className='price-card'+(i===1?' popular':'');
  card.innerHTML=`${i===1?'<span class="tag">POPULAR CHOICE</span>':''}<small>FULL HOME CLEANING</small><h3>${bhk}</h3><div class="price">${inr(p.base)}</div><p class="price-note">Without wall cleaning · guide price</p><div class="wallprice">With wall cleaning <b>${p.wallMin===p.wallMax?inr(p.wallMin):inr(p.wallMin)+'–'+inr(p.wallMax)}</b></div><button class="btn btn-ghost" type="button" data-bhk="${bhk}">Choose ${bhk} ↗</button>`;
  priceGrid.appendChild(card);
});
document.querySelectorAll('[data-bhk]').forEach(btn=>btn.addEventListener('click',()=>{document.getElementById('bhk').value=btn.dataset.bhk;updateEstimate();document.getElementById('booking').scrollIntoView({behavior:'smooth'});}));
const bhkEl=document.getElementById('bhk'), wallEl=document.getElementById('wall'), estimate=document.getElementById('estimate');
function updateEstimate(){const p=PACKAGES[bhkEl.value];if(!p){estimate.textContent='Select your home size';return;}estimate.textContent=wallEl.value==='yes'?(p.wallMin===p.wallMax?inr(p.wallMin):inr(p.wallMin)+'–'+inr(p.wallMax)):inr(p.base);}
bhkEl.addEventListener('change',updateEstimate);wallEl.addEventListener('change',updateEstimate);
const dateEl=document.getElementById('date');const today=new Date();dateEl.min=new Date(today.getTime()-today.getTimezoneOffset()*60000).toISOString().slice(0,10);
document.getElementById('year').textContent=new Date().getFullYear();
document.getElementById('menuBtn').addEventListener('click',()=>document.getElementById('nav').classList.toggle('open'));
document.querySelectorAll('#nav a').forEach(a=>a.addEventListener('click',()=>document.getElementById('nav').classList.remove('open')));
document.getElementById('bookingForm').addEventListener('submit',async e=>{e.preventDefault();const form=e.currentTarget;const f=new FormData(form);const p=PACKAGES[f.get('bhk')];const wall=f.get('wall')==='yes';const amount=wall?(p.wallMin===p.wallMax?inr(p.wallMin):inr(p.wallMin)+'–'+inr(p.wallMax)):inr(p.base);const msg=`Hello Saff Safaii Pune! I would like to request a cleaning booking.\n\nName: ${f.get('name')}\nPhone: ${f.get('phone')}\nHome size: ${f.get('bhk')}\nPackage: ${wall?'With wall cleaning':'Without wall cleaning'}\nGuide price: ${amount}\nPreferred date: ${f.get('date')}\nPreferred time: ${f.get('time')}\nAddress: ${f.get('address')}\nAdditional notes: ${f.get('notes')||'None'}\n\nPlease confirm availability and final scope/price.`;const msgEl=document.getElementById('formMessage');let dbSaved=false;try{const cfg=window.SAFF_SUPABASE_CONFIG;if(cfg?.url&&cfg?.anonKey&&window.supabase?.createClient){const client=window.supabase.createClient(cfg.url,cfg.anonKey);const {error}=await client.from('bookings').insert({customer_name:f.get('name'),phone:f.get('phone'),bhk:f.get('bhk'),wall_cleaning:wall,guide_price:amount,preferred_date:f.get('date'),preferred_time:f.get('time'),address:f.get('address'),notes:f.get('notes')||'',status:'new'});if(error)throw error;dbSaved=true;}}catch(err){console.error('Booking database save failed:',err);msgEl.textContent='Database save did not complete. WhatsApp will still open; please send your request there.';}if(!dbSaved&&window.SAFF_SUPABASE_CONFIG?.url){msgEl.textContent='Database save did not complete. WhatsApp will still open; please send your request there.';}else{msgEl.textContent=dbSaved?'Booking request saved and WhatsApp is opening. This is not yet a confirmed appointment.':'Opening WhatsApp with your booking request. Configure Supabase to save bookings in the admin dashboard.';}window.open('https://wa.me/918484915002?text='+encodeURIComponent(msg),'_blank','noopener');});
