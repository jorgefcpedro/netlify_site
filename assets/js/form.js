(function(){
  // Save basic form data between pages (optional)
  function saveForm(form){
    const data = {};
    new FormData(form).forEach((v,k)=>{data[k]=v});
    try{ localStorage.setItem('avaliacao_form', JSON.stringify(data)); }catch(e){}
  }

  function loadForm(form){
    try{
      const raw = localStorage.getItem('avaliacao_form');
      if(!raw) return;
      const data = JSON.parse(raw);
      Object.keys(data).forEach(k=>{
        const el = form.querySelector(`[name="${k}"]`);
        if(el && (el.type !== 'file')) el.value = data[k];
      });
    }catch(e){}
  }

  // Wire up page forms
  const step1 = document.querySelector('form[data-step="1"]');
  if(step1){
    loadForm(step1);
    step1.addEventListener('submit', (e)=>{
      e.preventDefault();
      saveForm(step1);
      window.location.href = 'step2.html';
    });
  }

  const step2 = document.querySelector('form[data-step="2"]');
  if(step2){
    loadForm(step2);
    step2.addEventListener('submit', (e)=>{
      e.preventDefault();
      saveForm(step2);
      window.location.href = 'step3.html';
    });
    const skip = document.querySelector('[data-skip="2"]');
    if(skip){
      skip.addEventListener('click', (e)=>{
        e.preventDefault();
        window.location.href = 'step3.html';
      });
    }
  }

  const step3 = document.querySelector('form[data-step="3"]');
  if(step3){
    loadForm(step3);
    step3.addEventListener('submit', (e)=>{
      e.preventDefault();
      saveForm(step3);
      window.location.href = 'success.html';
    });

    // Upload UI
    const fileInput = step3.querySelector('input[type="file"]');
    const list = document.querySelector('[data-files]');
    const drop = document.querySelector('[data-dropzone]');

    function renderFiles(files){
      if(!list) return;
      if(!files || files.length===0){
        list.textContent = '';
        return;
      }
      const names = Array.from(files).slice(0,10).map(f=>f.name);
      list.innerHTML = '<strong>Ficheiros selecionados:</strong><br>' + names.join('<br>');
    }

    if(fileInput){
      fileInput.addEventListener('change', ()=>renderFiles(fileInput.files));
    }

    if(drop && fileInput){
      ;['dragenter','dragover'].forEach(evt=>drop.addEventListener(evt,(e)=>{
        e.preventDefault(); e.stopPropagation();
        drop.style.background = 'rgba(255,255,255,0.06)';
      }));
      ;['dragleave','drop'].forEach(evt=>drop.addEventListener(evt,(e)=>{
        e.preventDefault(); e.stopPropagation();
        drop.style.background = 'rgba(0,0,0,0.08)';
      }));
      drop.addEventListener('drop',(e)=>{
        const dt = e.dataTransfer;
        if(!dt) return;
        const files = Array.from(dt.files).slice(0,10);
        const transfer = new DataTransfer();
        files.forEach(f=>transfer.items.add(f));
        fileInput.files = transfer.files;
        renderFiles(fileInput.files);
      });
    }
  }

  // Success page: clear data when leaving
  const clearBtn = document.querySelector('[data-clear]');
  if(clearBtn){
    clearBtn.addEventListener('click', ()=>{
      try{ localStorage.removeItem('avaliacao_form'); }catch(e){}
    });
  }
})();
