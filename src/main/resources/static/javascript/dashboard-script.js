/* CSTU Pantip — Dashboard logic (admin-aware, guest supported)
   Canonical Review shape (schema):
   {
     id: string,
     course: string,
     professor?: string,
     rating: number,    // 1..5
     comment: string,   // review text
     createdAt: number,
     author?: { name?: string, avatar?: string }
   }
*/
;(() => {
  const LS_KEY = 'courseReviews'

  const qs  = (sel, el=document) => el.querySelector(sel)
  const qsa = (sel, el=document) => [...el.querySelectorAll(sel)]

  // ---------- ดึง API มาจากเว็ป ----------

      const readReviewsFromAPI = async () => {
        try {
    	  const API_URL = 'http://localhost:8081/api/review';
          const response = await fetch(API_URL);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          } else {
    		/*alert("Linking complete")*/
    	  }
    	  

          const arr = await response.json();
    	  /*console.log(arr);*/
    	  	
          if (!Array.isArray(arr)) {
            console.error('API did not return an array. Using empty array.');
            return [];
          }

          
          const { rows } = normalizeRows(arr);
    	  /*console.log("this is data" + rows);*/
          return rows;

        } catch (e) {
          console.error('Failed to fetch reviews from API:', e);
          return [];
        }
      }
  
  const formatDate = (ts) => {
    const d = new Date(ts || Date.now())
    return d.toLocaleDateString('th-TH', { year:'numeric', month:'short', day:'numeric' })
  }

  const safeParse = (raw) => { try { return JSON.parse(raw) } catch(e){ return null } }

  const readLS = () => {
    const raw = localStorage.getItem(LS_KEY)
    const arr = safeParse(raw)
    if (!Array.isArray(arr)) return []
    // ซ่อม/แปลงข้อมูลเก่าให้เป็น schema เดียวกัน
    const { rows, changed } = normalizeRows(arr)
    if (changed) writeLS(rows)
    return rows
  }
  
  
  async function deleteById(uid){
  	
	console.log(uid)
	
	try{
		const API_URL = 'http://localhost:8081/api/review/delete';
		const response = await fetch(API_URL, {
		  method: "DELETE",
		  headers:{'Content-Type': 'application/json'},
		  body: JSON.stringify({ id: uid })
		});
		if (!response.ok){
			throw new Error(`HTTP error! status: ${response.status}`); 
		} else{
			window.location.reload();
		}
	} catch (e){
		alert(e)
	}
  }

  const writeLS = (rows) => {
    localStorage.setItem(LS_KEY, JSON.stringify(rows || []))
  }

  // ---- NORMALIZER: map field เก่า → ใหม่ + เติมค่าให้ครบ ----
  function normalizeRows(arr){
    let changed = false
    const rows = arr.map((r) => {
      const n = { ...r }
	  
	  /*console.log(n)*/
	  
      // mapping จากชื่อคีย์ที่อาจเคยใช้ใน review.html เดิม
      if (n.subject && !n.course) { n.course = String(n.subject).trim(); changed = true }
      if (n.title && !n.course) { n.course = String(n.title).trim(); changed = true }

      if (n.teacher && !n.professor) { n.professor = String(n.teacher).trim(); changed = true }
      if (n.lecturer && !n.professor) { n.professor = String(n.lecturer).trim(); changed = true }

      if (n.review && !n.comment) { n.comment = String(n.review).trim(); changed = true }
      if (n.text && !n.comment)   { n.comment = String(n.text).trim(); changed = true }
      if (typeof n.comment !== 'string') { n.comment = n.comment ? String(n.comment) : ''; changed = true }

      // rating ให้เป็นเลข 1..5
      const rate = Number(n.rating)
      if (!Number.isFinite(rate) || rate < 1 || rate > 5) { n.rating = Math.max(1, Math.min(5, rate || 3)); changed = true }

      // เติม id / createdAt ถ้ายังไม่มี
      if (!n.id) { n.id = cryptoRandom(); changed = true }
      if (!n.createdAt) { n.createdAt = Date.now(); changed = true }

      // author fallback
      if (!n.author) { n.author = { name: n.name || 'anonymous', avatar: n.avatar || '' }; changed = true }
      if (!n.author.name) { n.author.name = 'anonymous'; changed = true }

      // ตัดช่องว่าง
      if (typeof n.course === 'string') n.course = n.course.trim()
      if (typeof n.professor === 'string') n.professor = n.professor.trim()
      if (typeof n.comment === 'string') n.comment = n.comment.trim()

      return n
    })
    return { rows, changed }
  }

  const debounce = (fn, wait=180) => {
    let t
    return (...args)=>{ clearTimeout(t); t=setTimeout(()=>fn(...args), wait) }
  }

  const showToast = (msg='Saved') => {
    const el = qs('#toast')
    if(!el) return
    el.textContent = msg
    el.classList.add('is-show')
    setTimeout(()=> el.classList.remove('is-show'), 1600)
  }

  const escapeHTML = (s='') => s.replace(/[&<>"']/g, (m)=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[m]))

  // ---------- STATE ----------
  const state = {
    isAdmin: false,      // true = แอดมิน (เห็นปุ่มลบ)
    q: '',
    stars: new Set(),
    rows: []
  }

  // ---------- UI RENDER ----------
  const matchFilter = (r) => {
    const q = state.q.trim().toLowerCase()
    const passQ = !q || (
      (r.name||'').toLowerCase().includes(q) ||
      (r.prof||'').toLowerCase().includes(q) ||
      (r.comment||'').toLowerCase().includes(q)
    )
    const passStar = state.stars.size === 0 || state.stars.has(+r.rating)
    return passQ && passStar
  }

  const updateResultBadge = (n) => {
    const b = qs('#resultMeta')
    if(!b) return
    b.textContent = `${n} review${n===1?'':'s'}`
  }

  const renderCard = (r) => {
  const wrap = document.createElement('article')
  wrap.className = 'card'

  const name = escapeHTML(r.name || 'Unknown course')
  const stars = '⭐'.repeat(+r.rating || 0)
  const metaRight = `${formatDate(r.createdAt)}`
  const profText = `Professor: ${escapeHTML(r.prof || '-')}`

  // ใช้ avatar จาก review (ถ้าไม่มีจะไม่แสดง)
  const avatarSrc = (r?.author?.avatar || '').trim()
  const avatarHTML = avatarSrc
    ? `<img class="card__avatar" src="${escapeHTML(avatarSrc)}" alt="reviewer avatar">`
    : ''

  // เนื้อหารีวิว
  const body = r.description
    ? escapeHTML(r.description)
    : '<span style="color:#9c8b70">— no review text —</span>'

	wrap.innerHTML = `
	    <header class="card__head">
	      <div>
	        <div class="card__course">${name}</div>
	        <div class="card__meta">${profText}</div>
	      </div>
	      <div class="card__topRight">
	        <div class="stars" aria-label="${r.rating} stars">${stars}</div>
	        ${avatarHTML}
	      </div>
	    </header>

	    <div class="card__body">${body}</div>

	    <footer class="card__footer">
	      <span class="kbd">${metaRight}</span>
	      <div class="act">
	        ${state.isAdmin
	          ? `<button class="btn btn--danger btn--sm" data-act="delete" data-id="${r.id}">Delete</button>`
	          : ``}
	      </div>
	    </footer>
	  `
  return wrap
}


  const renderGrid = async () => {
    const grid = qs('#reviewGrid')
    if(!grid) return
    grid.innerHTML = ''

    const rows = await readReviewsFromAPI();
    state.rows = rows

    const filtered = rows.filter(matchFilter).sort((a,b)=> b.createdAt - a.createdAt)
    updateResultBadge(filtered.length)

    if(filtered.length === 0){
      const empty = document.createElement('div')
      empty.className = 'empty'
      empty.innerHTML = `ไม่มีรีวิวที่ตรงกับการค้นหา/ตัวกรองในตอนนี้`
      grid.appendChild(empty)
      return
    }

    filtered.forEach(r => grid.appendChild(renderCard(r)))
  }

  // ---------- BIND ----------
  const bindHandlers = () => {
    // search
    const s = qs('#searchInput')
    if(s){
      s.addEventListener('input', debounce((e)=>{
        state.q = e.target.value || ''
        renderGrid()
      }, 120))
    }

    // star chips
    const wrap = qs('#starFilters')
    if(wrap){
      wrap.addEventListener('click', (e)=>{
        const btn = e.target.closest('button')
        if(!btn) return
        if(btn.id === 'clearFilters'){
          state.stars.clear()
          qsa('.chip[data-star]').forEach(b=> b.classList.remove('is-active'))
          renderGrid()
          return
        }
        const star = +btn.dataset.star
        if(!star) return
        if(state.stars.has(star)){
          state.stars.delete(star)
          btn.classList.remove('is-active')
        }else{
          state.stars.add(star)
          btn.classList.add('is-active')
        }
        renderGrid()
      })
    }

    // grid actions (delete only for admin)
    const grid = qs('#reviewGrid')
    if(grid){
      grid.addEventListener('click', (e)=>{
        const bt = e.target.closest('[data-act="delete"]')
        if(!bt) return
        const id = bt.dataset.id
        if(!id) 
			return
		deleteById(id)
     
		
      })
    }

    // write review
    const w1 = qs('#linkWrite'), w2 = qs('#writeCTA2')
    ;[w1,w2].forEach(x=>{
      if(!x) return
      x.addEventListener('click', (ev)=>{
        ev.preventDefault()
        window.location.href = '/review'
      })
    })

    // back
    const back = qs('#btnBack')
    if(back){
      back.addEventListener('click', ()=>{
        (window.location.href='/')
      })
    }

    // logout -> clear admin flag & go to login
    const lo = qs('#btnLogout')
    if(lo){
      lo.addEventListener('click', (e)=> {
        e.preventDefault()
        try { sessionStorage.removeItem('isAdmin') } catch(e){}
        showToast('Logged out')
        setTimeout(()=> window.location.href='/', 400)
      })
    }
  }

  // ---------- SEED (demo only if empty) ----------
  function seedIfEmpty(){
    if(readLS().length) return
    const now = Date.now()
    const demo = [
      { id: cryptoRandom(), course:'CS101 - Intro', professor:'Aj. Mint', rating:4, comment:'พื้นฐานแน่น เข้าใจง่าย', createdAt: now-86400*1000*2, author:{name:'Guest'} },
      { id: cryptoRandom(), course:'CS111 - Algo', professor:'Aj. Pisit', rating:5, comment:'อธิบายชัด เคสตัวอย่างเยอะ', createdAt: now-86400*1000*6, author:{name:'Alpha'} },
    ]
    writeLS(demo)
  }

  function cryptoRandom(){
    if(window.crypto?.getRandomValues){
      const b = new Uint32Array(2); crypto.getRandomValues(b)
      return `r-${b[0].toString(16)}${b[1].toString(16)}`
    }
    return `r-${Math.random().toString(16).slice(2)}`
  }

  // ---------- PUBLIC API ----------
  window.CSTU = window.CSTU || {}
  window.CSTU.initDashboard = function initDashboard(){
    try {
      state.isAdmin = (sessionStorage.getItem('isAdmin') === 'true')
    } catch(e){ state.isAdmin = false }
    seedIfEmpty()
    bindHandlers()
    renderGrid()
  }
  
  
  
})()
