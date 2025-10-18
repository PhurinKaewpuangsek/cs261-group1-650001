/* CSTU Pantip — Review form saver (writes to localStorage "courseReviews")
   Schema ที่ Dashboard อ่าน:
   { id, course, professor, rating(1..5), comment, createdAt, author:{name,avatar} }
*/
;(() => {
  const LS_KEY = 'courseReviews'
  const LIMIT = 220; // ✅ จำกัดความยาวรีวิวเพื่อไม่ให้ทะลุการ์ด

  // ---------- helpers ----------
  const qs  = (sel, el=document) => el.querySelector(sel)
  const qsa = (sel, el=document) => Array.from(el.querySelectorAll(sel))
  const getVal = (selectors) => {
    for (const s of selectors) {
      const el = qs(s)
      if (el && 'value' in el) return String(el.value).trim()
    }
    return ''
  }
  const readLS = () => {
    try { const j = JSON.parse(localStorage.getItem(LS_KEY)||'[]'); return Array.isArray(j)?j:[] }
    catch{ return [] }
  }
  const writeLS = (rows) => localStorage.setItem(LS_KEY, JSON.stringify(rows||[]))
  const rid = () => {
    if (crypto?.getRandomValues) {
      const b = new Uint32Array(2); crypto.getRandomValues(b)
      return `r-${b[0].toString(16)}${b[1].toString(16)}`
    }
    return `r-${Math.random().toString(16).slice(2)}`
  }

  // ---------- rating ----------
  function parseRatingFromText(txt=''){
    const n = Number(String(txt).replace(/[^\d]/g,''))
    return (n>=1 && n<=5) ? n : NaN
  }

  function getRating(){
    const hidden = qs('#ratingValue,input[name="ratingValue"][type="hidden"],input[name="rating"][type="number"]')
    if (hidden && hidden.value) {
      const v = Number(hidden.value); if (v>=1 && v<=5) return v
    }
    const radio = qs('input[name="rating"]:checked')
    if (radio) {
      const v = Number(radio.value); if (v>=1 && v<=5) return v
    }
    const activeBtn = qs('[data-rating].is-active, [data-rating].selected, [data-rating][aria-pressed="true"]')
                    || qs('.rating .star-box.is-active, .rating .star-box.selected')
    if (activeBtn) {
      const v = Number(activeBtn.dataset.rating || parseRatingFromText(activeBtn.textContent))
      if (v>=1 && v<=5) return v
    }
    return 3
  }

  function bindRatingClicks(){
    const container = qs('#ratingBox') || qs('#ratingGroup') || qs('.rating') || document
    container.addEventListener('click', (e)=>{
      const btn = e.target.closest('[data-rating], .rating .star-box, .rating .chip')
      if (!btn) return
      const val = Number(btn.dataset.rating || parseRatingFromText(btn.textContent))
      if (!(val>=1 && val<=5)) return
      qsa('[data-rating], .rating .star-box, .rating .chip', container)
        .forEach(el => { el.classList.remove('is-active','selected'); el.removeAttribute('aria-pressed') })
      btn.classList.add('is-active','selected')
      btn.setAttribute('aria-pressed','true')
      const hv = qs('#ratingValue') || qs('input[name="ratingValue"][type="hidden"]')
      if (hv) hv.value = String(val)
    })
  }

  // ---------- avatar ----------
  function bindAvatarPicker(){
    const preview = qs('#avatarPreview')
    const options = qsa('.avatar-option')
    if (!options.length) return

    options.forEach(img => {
      img.addEventListener('click', ()=>{
        qsa('.avatar-option').forEach(i => i.classList.remove('is-active','selected'))
        img.classList.add('is-active','selected')
        if (preview) preview.src = img.src
      })
    })
  }

  function getAvatar(){
    const el = qs('.avatar-option.is-active, .avatar-option.selected')
    return el ? (el.getAttribute('src') || '') : (qs('#avatarPreview')?.getAttribute('src') || '')
  }

  // ---------- author mode ----------
  function getAuthorName(){
    const isProfile = qs('#profileMode')?.classList.contains('active')
                   || qs('#profileMode')?.getAttribute('aria-pressed') === 'true'
    if (isProfile) {
      return getVal(['#displayName','input[name="displayName"]']) || 'profile'
    }
    return 'anonymous'
  }

  function bindAuthorModeToggle(){
    const profBtn = qs('#profileMode')
    const anonBtn = qs('#anonymousMode')
    if (!profBtn || !anonBtn) return
    const setActive = (mode) => {
      if (mode === 'profile') {
        profBtn.classList.add('active'); profBtn.setAttribute('aria-pressed','true')
        anonBtn.classList.remove('active'); anonBtn.setAttribute('aria-pressed','false')
      } else {
        anonBtn.classList.add('active'); anonBtn.setAttribute('aria-pressed','true')
        profBtn.classList.remove('active'); profBtn.setAttribute('aria-pressed','false')
      }
    }
    profBtn.addEventListener('click', ()=> setActive('profile'))
    anonBtn.addEventListener('click', ()=> setActive('anonymous'))
  }

  // ---------- text limit feedback ----------
  function setupTextLimiter(){
    const ta = qs('#reviewText')
    const fb = qs('#charCount')
    const submitBtn = qs('button[type="submit"], #btnSubmit')

    const render = () => {
      const len = (ta?.value || '').length
      if (!fb) return
      const ok = len <= LIMIT
      fb.textContent = `${len}/${LIMIT} — ${ok ? 'OK' : 'Too long'}`
      fb.classList.toggle('ok', ok)
      fb.classList.toggle('too-long', !ok)
      if (submitBtn) submitBtn.disabled = !ok
    }

    // initial text
    if (fb) { fb.textContent = `0/${LIMIT}` }
    render()

    ta?.addEventListener('input', render)
  }

  // ---------- SAVE ----------
  async function saveReview(ev){
    ev?.preventDefault?.()

    const course    = getVal(['#subject', '#course', 'input[name="subject"]', 'input[name="course"]', '#Subject'])
    const professor = getVal(['#professor', 'input[name="professor"]', '#teacher', 'input[name="teacher"]'])
    const ta        = qs('#reviewText')
    let comment     = getVal(['#reviewText','#review', '#comment', 'textarea[name="review"]', 'textarea[name="comment"]'])
    if (!comment) {
      const t = qs('textarea'); comment = t ? String(t.value).trim() : ''
    }

    // ✅ กันยาวเกิน: ไม่ให้บันทึกถ้าเกิน และ focus ให้แก้
    if (comment.length > LIMIT) {
      ta?.focus()
      return
    }
    // กัน edge case: trim ให้ชัวร์ก่อนเซฟ
    comment = comment.slice(0, LIMIT)

    
	
	const reviewCard = {
		      name: course,
		      prof: professor,
		      description: comment,
		      rating: Math.max(1, Math.min(5, Number(getRating())||3))
		 };
		 
		 try{
			const API_URL = 'http://localhost:8081/api/review/post';
			const response = await fetch(API_URL,{
				method: 'POST',
				headers:{
				'Content-Type': 'application/json'
				},
				body:JSON.stringify(reviewCard)
			});
			if(response.ok){
				alert('ส่งข้อมูลสำเร็จ!')
				try { window.location.href = '/dashboard' } catch {}
				
			} else{
				alert('ส่งข้อมูลไม่ได้จ้าาา ไม่โอเค เพราะ :' + response.status)
			}
		 } catch(error){
			console.error('ส่งข้อมูลไม่ได้จ้าาา error เพราะ :' + error)
		 }

  }

  // ---------- INIT ----------
  document.addEventListener('DOMContentLoaded', () => {
    bindRatingClicks()
    bindAvatarPicker()
    bindAuthorModeToggle()
    setupTextLimiter()

    // bind ปุ่ม Submit + กันพลาด submit form
    const form = qs('form') || document
    const submitBtn = qs('button[type="submit"], #btnSubmit')
    submitBtn?.addEventListener('click', saveReview)
    if (form && form.tagName === 'FORM') form.addEventListener('submit', saveReview)

    // ✅ ปุ่ม Cancel ให้ย้อนกลับ dashboard โดยไม่บันทึก
    const cancelBtn = qs('#btnCancel')
    cancelBtn?.addEventListener('click', (e)=>{
      e.preventDefault()
      try { window.location.href = '/dashboard' } catch {}
    })
  })
})()
