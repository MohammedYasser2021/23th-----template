let audio = document.querySelector('.audio')
let surahsContainer = document.querySelector('.quraan-surahs')
let ayah = document.querySelector('.ayah')
let quraanNext = document.querySelector('.quraan-next')
let play = document.querySelector('.play')
let quraanPrev = document.querySelector('.quraan-prev')
let isPlay = false
getSurahs()
function getSurahs() {
  // fetch to get surahs data
  fetch('https://api.quran.sutanlab.id/surah')
    .then((response) => response.json())
    .then((data) => {
      data.data.forEach((ele) => {
        surahsContainer.innerHTML += `
        <div>
         <p>${ele.name.long}</p>
         <p>${ele.name.transliteration.en}</p>
        </div>
        `
      })
      // select all surahs
      let allSurahs = document.querySelectorAll('.quraan-surahs div')
      let ayasAudios
      let ayasText
      allSurahs.forEach((ele, index) => {
        ele.addEventListener('click', function () {
          fetch(`https://api.quran.sutanlab.id/surah/${index + 1}`)
            .then((response) => response.json())
            .then((data) => {
              let verses = data.data.verses
              ayasAudios = []
              ayasText = []
              verses.forEach((verse) => {
                ayasAudios.push(verse.audio.primary)
                ayasText.push(verse.text.arab)
              })
              let ayahIndex = 0
              changeAyah(ayahIndex)
              audio.addEventListener('ended', function () {
                ayahIndex++
                if (ayahIndex < ayasAudios.length) {
                  changeAyah(ayahIndex)
                } else {
                  ayahIndex = 0
                  changeAyah(index)
                  audio.pause()
                  Swal.fire({
                    icon: 'success',
                    title: 'السورة انتهت',
                  })
                  play.innerHTML = `
                  <i class="fa fa-play"></i>
                  `
                }
              })
              // handle next and prev
              quraanNext.addEventListener('click', function () {
                if (ayahIndex < ayasAudios.length - 1) {
                  ayahIndex++
                } else {
                  ayahIndex = 0
                }
                changeAyah(ayahIndex)
              })
              quraanPrev.addEventListener('click', function () {
                if (ayahIndex > 0) {
                  ayahIndex--
                } else {
                  ayahIndex = ayasAudios.length - 1
                }
                changeAyah(ayahIndex)
              })
              // handle play and pause audio
              play.addEventListener('click', function () {
                if (isPlay === true) {
                  audio.pause()
                  play.innerHTML = `
                      <i class="fa fa-play"></i>
                      `
                  isPlay = false
                } else {
                  audio.play()
                  play.innerHTML = `
                    <i class="fa fa-pause"></i>
                    `
                  isPlay = true
                }
                console.log(isPlay)
              })
              function changeAyah(index) {
                audio.src = ayasAudios[index]
                ayah.innerHTML = ayasText[index]
                isPlay = true
                if (isPlay) {
                  play.innerHTML = `
                    <i class="fa fa-pause"></i>
                    `
                }
              }
            })
        })
      })
    })
}
