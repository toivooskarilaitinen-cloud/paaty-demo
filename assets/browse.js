const form=document.querySelector('.filters');
if(form){
 const controls=[...form.elements].filter(el=>el.name);
 const rows=[...document.querySelectorAll('.results li')];
 const normalize=s=>s.toLocaleLowerCase('fi').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 const indexed=rows.map(el=>({el,text:normalize(el.dataset.search),facets:Object.fromEntries(controls.filter(c=>c.tagName==='SELECT').map(c=>[c.name,JSON.parse(el.dataset[c.name])]))}));
 function apply(updateUrl){
  const words=normalize(form.elements.q.value.trim()).split(/\s+/).filter(Boolean);
  const selects=controls.filter(c=>c.tagName==='SELECT'&&c.value);
  let count=0;
  for(const item of indexed){
   const show=words.every(w=>item.text.includes(w))&&selects.every(c=>item.facets[c.name].includes(c.value));
   item.el.hidden=!show;if(show)count++;
  }
  document.querySelector('.count').textContent=count===1?'1 sisältö':count+' sisältöä';
  document.querySelector('.empty').hidden=count!==0;
  if(updateUrl&&location.protocol!=='file:'){const url=new URL(location.href);for(const el of controls){if(el.value)url.searchParams.set(el.name,el.value);else url.searchParams.delete(el.name)}history.replaceState(null,'',url)}
 }
 function restore(){const params=new URLSearchParams(location.search);for(const c of controls)c.value=params.get(c.name)||'';apply(false)}
 restore();window.addEventListener('popstate',restore);
 form.addEventListener('input',()=>apply(true));form.addEventListener('submit',e=>{e.preventDefault();apply(true)});
 form.addEventListener('reset',()=>setTimeout(()=>apply(true),0));
}
