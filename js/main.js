// start navbar
$(function () {
  $('.main-nav .bars').on('click', function () {
    $('.main-nav .links').slideToggle(500)
  })
  $('.fixed-nav .bars').on('click', function () {
    $('.fixed-nav .links').slideToggle(500)
  })
  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 80) {
      $('.fixed-nav').slideDown(500)
    } else {
      $('.fixed-nav').hide()
    }
  })
})
// end navbar

// start explorer button
let explorerBtn = document.querySelector('.start-explorer')
let hadithSection = document.querySelector('.hadith')

explorerBtn.addEventListener('click', function () {
  hadithSection.scrollIntoView({
    behavior: 'smooth',
  })
})
// end explorer button

// start hadith API
let hadithContainer = document.querySelector('.hadith-container')
let hadithNext = document.querySelector('.hadith-btns .next')
let hadithPrev = document.querySelector('.hadith-btns .prev')
let hadithNum = document.querySelector('.hadith-btns .num')
let hadithIndex = 0

let hadithApi = 'https://api.hadith.sutanlab.id/books/muslim?range=1-300'
async function getHadith() {
  try {
    const response = await fetch(hadithApi)
    const data = await response.json()
    let hadith = data.data.hadiths
    changeHadithContent()
    function changeHadithContent() {
      hadithContainer.innerHTML = hadith[hadithIndex].arab
      hadithNum.innerHTML = `300 / ${hadithIndex + 1}`
    }

    function buttonsClass() {
      hadithNext.classList.remove('disabled')
      hadithPrev.classList.remove('disabled')
    }

    hadithNext.addEventListener('click', function () {
      if (hadithIndex < 299) {
        buttonsClass()
        hadithIndex++
      } else {
        hadithNext.classList.add('disabled')
      }
      changeHadithContent()
    })

    hadithPrev.addEventListener('click', function () {
      if (hadithIndex > 0) {
        buttonsClass()
        hadithIndex--
      } else {
        hadithPrev.classList.add('disabled')
      }
      changeHadithContent()
    })
  } catch (e) {
    console.log(e.message)
  }
}
getHadith()
// end hadith API

// start lectures api
let right = document.querySelector('.right')
let iFrame = document.querySelector('.left iframe')
let iFrameHeading = document.querySelector('.left h2')
let lecturesAPI = 'js/lectures.json'

async function getLectures() {
  try {
    let response = await fetch(lecturesAPI)
    let data = await response.json()
    iFrame.src = `https://www.youtube.com/embed/${data[0].iframeData}`
    iFrameHeading.innerHTML = `${data[0].title}`
    for (let i = 0; i < data.length; i++) {
      let lectureBox = document.createElement('div')
      lectureBox.className = 'lecture-box'
      let lectureInfo = document.createElement('div')
      lectureInfo.className = 'lecture-info'
      let heading = document.createElement('h4')
      let headingText = document.createTextNode(`${data[i].title}`)
      heading.appendChild(headingText)

      let readerName = document.createElement('p')
      let readerNameText = document.createTextNode(`${data[i].name}`)
      readerName.appendChild(readerNameText)

      let watchBtn = document.createElement('button')
      watchBtn.className = 'watch'
      watchBtn.setAttribute('data-watch', `${data[i].id}`)
      let watchBtnText = document.createTextNode('watch')
      watchBtn.appendChild(watchBtnText)

      watchBtn.addEventListener('click', function (e) {
        let selectedLecture = data.find(
          (ele) => ele.id == e.target.dataset.watch,
        )
        iFrame.src = `https://www.youtube.com/embed/${selectedLecture.iframeData}`
        iFrameHeading.innerHTML = `${selectedLecture.title}`
      })

      lectureInfo.appendChild(heading)
      lectureInfo.appendChild(readerName)
      lectureInfo.appendChild(watchBtn)

      let lectureImage = document.createElement('img')
      lectureImage.src = `${data[i].image}`
      lectureImage.alt = `image`

      lectureBox.appendChild(lectureInfo)
      lectureBox.appendChild(lectureImage)

      right.appendChild(lectureBox)
    }
  } catch (e) {
    console.log(e.message)
  }
}
getLectures()
// end lectures api

// start link with sections

let link = document.querySelectorAll('.links a')

link.forEach((ele) => {
  ele.addEventListener('click', function (e) {
    e.preventDefault()
    link.forEach((el) => {
      el.classList.remove('active')
    })
    ele.classList.add('active')
    link.forEach((item) => {
      if (item.dataset.scroll == ele.dataset.scroll) {
        item.classList.add('active')
      }
    })
    document.querySelector(ele.dataset.scroll).scrollIntoView({
      behavior: 'smooth',
    })
  })
})

window.addEventListener('scroll', function () {
  if (this.scrollY <= 0) {
    link.forEach((ele) => {
      ele.classList.remove('active')
    })
    link.forEach((ele) => {
      if (ele.dataset.scroll == '.header') {
        ele.classList.add('active')
      }
    })
  }
})

// end link with sections

/* start surah api */

let quranContainer = document.querySelector('.quran-container')
let surahAPI = 'https://api.alquran.cloud/v1/meta'
async function getSurah() {
  try {
    let response = await fetch(surahAPI)
    let data = await response.json()
    let surahs = data.data.surahs.references
    for (let i = 0; i < surahs.length; i++) {
      let surahDiv = document.createElement('div')
      surahDiv.className = 'surah'

      let surahArTitle = document.createElement('h4')
      surahArTitle.className = 'surah-ar'
      let surahArTitleText = document.createTextNode(`${surahs[i].name}`)
      surahArTitle.appendChild(surahArTitleText)

      let surahEnTitle = document.createElement('h4')
      surahEnTitle.className = 'surah-en'
      let surahEnTitleText = document.createTextNode(`${surahs[i].englishName}`)
      surahEnTitle.appendChild(surahEnTitleText)

      surahDiv.appendChild(surahArTitle)
      surahDiv.appendChild(surahEnTitle)

      quranContainer.appendChild(surahDiv)
    }

    let surahsDiv = document.querySelectorAll('.surah')
    let surahPopup = document.querySelector('.surah-popup')
    let surahsText = document.querySelector('.surah-text')
    let surahClosePopup = document.querySelector('.close-popup')

    surahsDiv.forEach((ele, index) => {
      ele.addEventListener('click', function () {
        fetch(`https://api.alquran.cloud/v1/surah/${index + 1}`)
          .then((response) => response.json())
          .then((data) => {
            surahsText.innerHTML = ''
            let ayahs = data.data.ayahs
            for (let i = 0; i < ayahs.length; i++) {
              let paragraphAyah = document.createElement('p')
              let paragraphAyahText = document.createTextNode(
                `(${ayahs[i].numberInSurah}) ${ayahs[i].text}`,
              )
              paragraphAyah.appendChild(paragraphAyahText)

              surahsText.appendChild(paragraphAyah)
            }
          })

        surahPopup.classList.add('active')

        surahClosePopup.addEventListener('click', function () {
          surahPopup.classList.remove('active')
        })
      })
    })
  } catch (e) {
    console.log(e.message)
  }
}
getSurah()
/* end surah api */

/* start pray times api */

let prayTimesContainer = document.querySelector('.pray-time-container')
let prayTimeAPI =
  'https://api.aladhan.com/v1/timingsByCity?city=alsharqia&country=egypt&method=8'
async function getPrayTimes() {
  try {
    let response = await fetch(prayTimeAPI)
    let data = await response.json()
    let times = data.data.timings
    let timesKeys = Object.keys(times)
    let timesValues = Object.values(times)

    for (let i = 0; i < timesKeys.length; i++) {
      prayTimesContainer.innerHTML += `<div class="pray-time-box">
                  <div class="pray-time-circle">
                  <div class="time">${timesValues[i]}</div>
                  </div>
                <h2>${timesKeys[i]}</h2>
          </div>`
    }
  } catch (e) {
    console.log(e.message)
  }
}
getPrayTimes()
/* end pray times api */

/* start scroll to top */

let scrollBtn = document.querySelector('.scroll-to-top')

window.addEventListener('scroll', function () {
  this.scrollY >= 200
    ? (scrollBtn.style.right = '20px')
    : (scrollBtn.style.right = '-60px')
})

scrollBtn.addEventListener('click', function () {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
})

/* end scroll to top */
