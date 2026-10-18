import {firebaseConfig, NUMERO_WHATSAPP, isConfigured} from './firebase-config.js';
import {initializeApp} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import {getFirestore,collection,onSnapshot,query,orderBy} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
const exemples = [
  {nom:'Beurre de karité naturel',categorie:'Karité brut',prix:2500,description:'Fiche de démonstration — à personnaliser.'},
  {nom:'Beurre de karité premium',categorie:'Karité brut',prix:5000,description:'Fiche de démonstration — à personnaliser.'},
  {nom:'Crème corporelle au karité',categorie:'Soins du corps',prix:3500,description:'Exemple non confirmé.'},
  {nom:'Savon au beurre de karité',categorie:'Soins du corps',prix:2000,description:'Exemple non confirmé.'},
  {nom:'Huile capillaire au karité',categorie:'Soins des cheveux',prix:4000,description:'Exemple non confirmé.'},
  {nom:'Baume à lèvres au karité',categorie:'Soins du corps',prix:1500,description:'Exemple non confirmé.'},
  {nom:'Gommage au karité',categorie:'Soins du corps',prix:3000,description:'Exemple non confirmé.'},
  {nom:'Beurre de massage',categorie:'Soins du corps',prix:3500,description:'Exemple non confirmé.'},
  {nom:'Masque capillaire au karité',categorie:'Soins des cheveux',prix:4500,description:'Exemple non confirmé.'},
  {nom:'Coffret découverte',categorie:'Coffrets',prix:12000,description:'Exemple non confirmé.'}
];
let produits=[...exemples,...Array.from({length:40},(_,i)=>({nom:`Produit à personnaliser ${i+11}`,categorie:'À personnaliser',prix:null,description:'Exemple à remplacer.'}))];
let live=false;
const $=id=>document.getElementById(id), grid=$('grid'),search=$('search'),filter=$('filter'),count=$('count'),empty=$('empty');
function el(tag,cls,txt){const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e}
function render(){grid.replaceChildren();const q=search.value.trim().toLocaleLowerCase('fr'),cat=filter.value;const selection=produits.filter(p=>(!cat||p.categorie===cat)&&(`${p.nom} ${p.description||''}`.toLocaleLowerCase('fr').includes(q)));count.textContent=`${selection.length} produit(s) affiché(s) sur ${produits.length}`;empty.hidden=selection.length>0;
for(const p of selection){const card=el('article','card'),art=el('div','art','Visuel à venir');if(p.photo && /^https:\/\//.test(p.photo)){const img=el('img');img.src=p.photo;img.alt=p.nom;img.loading='lazy';img.onerror=()=>img.remove();art.replaceChildren(img)}const body=el('div','card-body');body.append(el('span','tag',p.categorie||'Produit'),el('h3','',p.nom),el('p','',p.description||''),el('div','price',p.prix==null?'Prix sur demande':Number(p.prix).toLocaleString('fr-FR')+' FCFA'));const controls=el('div','controls'),label=el('label','','Quantité :'),qty=el('input');qty.type='number';qty.min='1';qty.max='999';qty.step='1';qty.value='1';label.htmlFor=qty.id=`q-${p.id||Math.random().toString(36).slice(2)}`;controls.append(label,qty);const btn=el('button','wa','☏ Commander sur WhatsApp');btn.addEventListener('click',()=>commander(p,qty));body.append(controls,btn);card.append(art,body);grid.append(card)}}
function commander(p,qty){const n=Number(qty.value);if(!Number.isInteger(n)||n<1||n>999){alert('Choisissez une quantité entre 1 et 999.');return}if(!/^\d{8,15}$/.test(NUMERO_WHATSAPP)){alert('Le numéro WhatsApp doit être configuré par la boutique.');return}const prix=p.prix==null?'À confirmer':`${(Number(p.prix)*n).toLocaleString('fr-FR')} FCFA${live?'':' (indicatif)'}`;const message=`Bonjour SCOOPS OWEDJO !\nJe souhaite commander :\nProduit : ${p.nom}\nQuantité : ${n}\nMontant : ${prix}\nMerci de confirmer la disponibilité et la livraison.`;window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(message)}`,'_blank','noopener,noreferrer')}
function renderAnnouncements(items){const box=$('annonces-list');box.replaceChildren();$('badge').textContent=items.length;$('badge').classList.toggle('hidden',!items.length);if(!items.length){box.append(el('p','muted','Aucune annonce pour le moment.'));return}for(const a of items){const card=el('div','announcement');card.append(el('strong','',a.titre||'Annonce'),el('p','',a.texte||''));box.append(card)}}
search.addEventListener('input',render);filter.addEventListener('change',render);render();
if(isConfigured()){
try{const db=getFirestore(initializeApp(firebaseConfig));onSnapshot(collection(db,'produits'),snap=>{const docs=snap.docs.map(d=>({id:d.id,...d.data()}));if(docs.length){produits=docs;live=true;$('demo-notice').classList.add('hidden')}else{$('demo-notice').classList.remove('hidden')}render();$('sync-status').textContent='';},e=>{$('sync-status').textContent='Catalogue indisponible : vérifiez la connexion et les règles Firebase.';$('sync-status').classList.add('error')});onSnapshot(collection(db,'annonces'),snap=>{const items=snap.docs.map(d=>d.data()).filter(a=>a.publie===true).sort((a,b)=>(b.creeLe?.seconds||0)-(a.creeLe?.seconds||0));renderAnnouncements(items)},e=>{console.error('Annonces indisponibles',e)});}catch(e){console.error(e);$('sync-status').textContent='Configuration Firebase invalide.'}
}else{$('sync-status').textContent='Mode démonstration : configurez Firebase pour activer les mises à jour en direct.'}
