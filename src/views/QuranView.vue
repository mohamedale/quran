<template>
  <main>
    <div class="head text-center">
      <div class="row" v-show="surahNo !== ''">
        <div class="col-sm-4 col-5">
          <h5 class="info-1 m-0">
            <span class="number main-color-two d-inline-block me-2">{{ surahNo }}</span>
            <span class="name ketab-font main-color-one">{{ surahName }}</span>
          </h5>
        </div>
        <div class="col-sm-4 col-2">
          <h5 class="info-2 m-0 main-color-one">{{ revelationType === 'Meccan' ? 'مكية' : 'مدنية' }}</h5>
        </div>
        <div class="col-sm-4 col-5">
          <h5 class="info-3 m-0 main-color-two">
            عدد الآيات: {{ numberOfAyahs }}
          </h5>
        </div>
      </div>
    </div>
    <div class="actions mt-3">
      <div class="row">
        <div class="col-md-4">
          <select id="translations-selector" class="form-select w-75 m-auto mb-md-0 mb-2 main-color-one shadow-none"
                  @change="getAyahsTranslations($event.target.value, $event.target.options[$event.target.selectedIndex])">
            <option value="">اختر الترجمة</option>
            <optgroup v-for="(langName, langKey) in languages" v-if="translations !== []" :label="langName">
              <option v-for="translation in translations.filter(trans => trans.language === langKey)"
                      :value="translation.identifier" :data-direction="translation.direction">
                {{ translation.name }}
              </option>
            </optgroup>
          </select>
        </div>
        <div class="col-md-4">
          <select id="write-type-selector" class="form-select w-75 m-auto mb-md-0 mb-2 main-color-one shadow-none"
                  @change="getAyahsWriteType($event.target.value, $event.target.options[$event.target.selectedIndex].text)">
            <option value="">اختر نوع الكتابة</option>
            <option v-for="type in writeTypes.filter(wType => !noNeededWriteType.includes(wType.identifier))"
                    :value="type.identifier">
              {{ type.name }}
            </option>
          </select>
        </div>
        <div class="col-md-4">
          <select id="tafsir-selector" class="form-select w-75 m-auto mb-md-0 mb-2 main-color-one shadow-none"
                  @change="getAyahsTafsir($event.target.value, $event.target.options[$event.target.selectedIndex].text)">
            <option value="">اختر التفسير</option>
            <option v-for="tafsir in tafsirs" :value="tafsir.identifier">
              {{ tafsir.name }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <div id="player-container" class="player-container mt-3">
      <div class="row">
        <div class="col-lg-5 col-md-6">
          <audio id="player" class="d-block w-100 mb-2" :current-ayah="currentAyah"
                 @playing="scrollToActiveAyah(currentAyah)"
                 @ended="switchAudio" controls>
            <source src="" type="audio/mpeg">
          </audio>
        </div>
        <div class="col-lg-2 col-md-3">
          <div class="row">
            <div class="col-sm-12 col-6">
              <select class="form-select main-color-one shadow-none mb-2 responsive-font-size"
                      @change="changeReader($event.target.value)">
                <option v-for="reader in readers.data" :value="reader.identifier"
                        :selected="reader.identifier === selectedReader">
                  {{ reader.name }}
                </option>
              </select>
            </div>
            <div class="col-sm-12 col-6">
              <select class="form-select main-color-one shadow-none mb-2 ketab-font"
                      @change="getSurahAyahs($event.target.value)">
                <option v-for="surah in surahs.data" :value="surah.number" :selected="$route.params.id == surah.number">
                  {{ surah.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="col-lg-2 col-md-3">
          <div class="row">
            <div class="col-sm-12 col-6">
              <select class="form-select mb-2 main-color-one shadow-none responsive-font-size"
                      @change="changeAudioQuality($event.target.value)">
                <option value="high"
                        :selected="$cookies.get('audio-quality') === 'high' || $cookies.get('audio-quality') === null">
                  جودة
                  الصوت عالية
                </option>
                <option value="low" :selected="$cookies.get('audio-quality') === 'low'">جودة الصوت منخفضة</option>
              </select>
            </div>
            <div class="col-sm-12 col-6">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="on" id="trackingAyah"
                       :checked="$cookies.get('tracking-ayah') === 'true'"
                       @change="trackingAyah($event.target.checked)">
                <label class="form-check-label main-color-one" for="trackingAyah">
                  تتبع الآية المقروءة
                </label>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-2 col-md-12">
          <div class="row">
            <div class="col-lg-12 col-sm-4 col-6">
              <div class="form-check">
                <input class="form-check-input" type="radio" name="repeatType" id="repeatAllSurahs" value="all"
                       @change="changeRepeatScope($event.target.value)"
                       :checked="$cookies.get('repeat-scope') === 'all' || $cookies.get('repeat-scope') === null">
                <label class="form-check-label main-color-one" for="repeatAllSurahs">
                  تكرار كل السور
                </label>
              </div>
            </div>
            <div class="col-lg-12 col-sm-4 col-6">
              <div class="form-check">
                <input class="form-check-input" type="radio" name="repeatType" id="repeatCurrentSurah" value="surah"
                       @change="changeRepeatScope($event.target.value)"
                       :checked="$cookies.get('repeat-scope') === 'surah'">
                <label class="form-check-label main-color-one" for="repeatCurrentSurah">
                  تكرار السورة الحالية
                </label>
              </div>
            </div>
            <div class="col-lg-12 col-sm-4 col-6">
              <div class="form-check">
                <input class="form-check-input" type="radio" name="repeatType" id="repeatCurrentAyah" value="ayah"
                       @change="changeRepeatScope($event.target.value)"
                       :checked="$cookies.get('repeat-scope') === 'ayah'">
                <label class="form-check-label main-color-one" for="repeatCurrentAyah">
                  تكرار الآية الحالية
                </label>
              </div>
            </div>
            <div class="col-lg-12 col-sm-4 col-6">
              <go-to-top-btn v-show="showScrollGoToTopBtn"></go-to-top-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="body" class="mt-3">
      <h3 class="ketab-font text-center main-color-one mb-3"
          v-if="$route.params.id !== '9' && !fetchSurahFailed && !loading">بِسْمِ
        ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</h3>
      <div class="ayah-box ketab-font d-inline" v-for="ayah in ayahs" v-if="!fetchSurahFailed && !loading"
           :id="ayah.number">
        <p class="ayah-text d-inline main-color-one" @click="playAyahAudio(ayah.number)">
          {{
            surahNo !== 1 && ayah.numberInSurah === 1 ? ayah.text.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ', '') : ayah.text
          }}
        </p>
        <span class="ayah-number text-center d-inline-block">{{ convertToArabicNumber(ayah.numberInSurah) }}</span>
        <!-- Translation div -->
        <div class="ayah-additional-data" :dir="selectedTranslationDir" v-if="!withoutTranslations"
             v-for="ayahTranslation in ayahsTranslation.filter(translation => translation.numberInSurah === ayah.numberInSurah)">
          <span class="additional-data-title translation-name">
            {{ selectedTranslationLangName + ' - ' + selectedTranslationAuthorName }}
          </span>
          <span class="additional-data-content translation-content">{{ ayahTranslation.text }}</span>
        </div>
        <!-- Write Type div -->
        <div class="ayah-additional-data" v-if="!withoutWriteTypes"
             v-for="ayahWriteType in ayahsWriteType.filter(writeType => writeType.numberInSurah === ayah.numberInSurah)">
          <span class="additional-data-title write-type-name">{{ selectedWriteTypeName }}</span>
          <span class="additional-data-content write-type-content">{{ ayahWriteType.text }}</span>
        </div>
        <!-- Tafsir div -->
        <div class="ayah-additional-data" v-if="!withoutTafsirs"
             v-for="ayahTafsir in ayahsTafsir.filter(tafsir => tafsir.numberInSurah === ayah.numberInSurah)">
          <span class="additional-data-title tafsir-name">{{ selectedTafsirName }}</span>
          <span class="additional-data-content tafsir-content">{{ ayahTafsir.text }}</span>
        </div>
      </div>
      <div v-if="fetchSurahFailed && !loading" class="fetch-failed text-center">
        <img src="/src/assets/icons/error.png" class="d-block m-auto" alt="فشل جلب الآية، حاول مرة اخرى.">
        <p class="m-auto main-color-one">فشل فى جلب السورة</p>
        <button class="mt-3 main-btn" @click="getSurahAyahs()">المحاولة مرة اخرى</button>
      </div>
      <div id="loading" v-if="loading"></div>
    </div>
  </main>
</template>

<style scoped>
.head,
.actions,
.player-container,
#body {
  background-color: #fff;
  border-radius: 1.5rem;
  padding: 1rem;
}

.head .info-1,
.head .info-2,
.head .info-3 {
  font-size: 1.05rem;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.head .info-1 .number {
  width: 2rem;
  height: 2rem;
  line-height: 2rem;
  border-radius: 50%;
  background-color: #41b88326;
  font-size: 1.2rem;
}

.head .info-1 .name {
  font-size: 1.4rem;
}

.player-container.fixed {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  width: 100%;
  border: 1px solid #eee;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.actions select,
.player-container select {
  border-radius: 1rem;
  border-color: #e4e8eb;
  font-size: .9rem;
}

.actions select:active,
.player-container select:active {
  border-color: #34495e;
}

.player-container input {
  cursor: pointer;
  box-shadow: none !important;
  transition: .2s all ease-in-out;
}

.player-container input:checked {
  background-color: #34495e;
  border-color: #34495e;
}

.player-container label {
  cursor: pointer;
  user-select: none;
  font-size: .7rem;
  font-weight: 700;
}

.fetch-failed p {
  font-weight: 700;
  font-size: .9rem;
}

#body .ayah-box {
  line-height: 2;
  transition: .2s all ease-in-out;
}

#body .ayah-box * {
  transition: .2s all ease-in-out;
}

#body .ayah-box:hover .ayah-text,
#body .ayah-box:hover .ayah-number {
  color: #41B883;
}

#body .ayah-box .ayah-text {
  font-size: 1.6rem;
  user-select: none;
  cursor: pointer;
}

#body .ayah-box.active .ayah-text {
  color: #41B883;
}

#body .ayah-box .ayah-number {
  background-color: #eee;
  border: 1px solid #d9d9d9;
  width: 2rem;
  height: 2rem;
  line-height: 2rem;
  border-radius: 50%;
  margin: 0 0.5rem;
  font-size: 1.5rem;
  user-select: none;
}

#body .ayah-box.active .ayah-number {
  color: #41B883;
}

#body .ayah-box .ayah-additional-data {
  font-size: 1.2rem;
  background-color: #ecf1f4;
  padding: 1rem;
  border-radius: 1.5rem;
  margin-bottom: 1rem;
}

#body .ayah-box .ayah-additional-data .additional-data-title {
  margin-left: 0.5rem;
  color: #fff;
  padding: 0 0.7rem;
  border-radius: 1rem;
  display: inline-block;
  line-height: normal;
}

#body .ayah-box .ayah-additional-data[dir="ltr"] .additional-data-title {
  margin-left: 0;
  margin-right: 0.5rem;
}

#body .ayah-box .ayah-additional-data .additional-data-title.write-type-name {
  background-color: #9B59B6;
}

#body .ayah-box .ayah-additional-data .additional-data-title.tafsir-name {
  background-color: #41B883;
}

#body .ayah-box .ayah-additional-data .additional-data-title.translation-name {
  background-color: #b84141;
}

#body .ayah-box .ayah-additional-data .additional-data-content {
  display: inline-block;
  line-height: normal;
}

@media (max-width: 576px) {
  .head .info-1 .number {
    width: 1.7rem;
    height: 1.7rem;
    line-height: 1.7rem;
    font-size: 1rem;
  }

  .head .info-1 .name {
    font-size: 1.2rem;
  }

  .head .info-2,
  .head .info-3 {
    font-size: .9rem;
  }

  .player-container select.responsive-font-size {
    font-size: .8rem;
  }
}

</style>

<script>

import GoToTopBtn from "../components/global/GoToTopBtn.vue";
import surahsJson from "@/assets/json/surahs"
import readersJson from "@/assets/json/readers"

export default {
  components: {GoToTopBtn},
  data() {
    return {
      surahNo: '',
      surahName: '',
      revelationType: '',
      numberOfAyahs: '',
      ayahs: [],
      sounds: [],
      translations: [],
      writeTypes: [],
      tafsirs: [],
      noNeededWriteType: ['quran-tajweed', 'quran-wordbyword', 'quran-kids', 'quran-corpus-qd',
        'quran-wordbyword-2', 'quran-uthmani-quran-academy', 'quran-simple-enhanced',
        'quran-simple-min'],
      readers: readersJson,
      surahs: surahsJson,
      withoutTranslations: true,
      withoutWriteTypes: true,
      withoutTafsirs: true,
      selectedReader: this.$cookies.get('reader-id'),
      selectedTranslationAuthorName: '',
      selectedTranslationLangName: '',
      ayahsTranslation: [],
      selectedTranslationDir: '',
      selectedWriteTypeName: '',
      ayahsWriteType: [],
      selectedTafsirName: '',
      ayahsTafsir: [],
      languages: {
        'sq': 'Albanian',
        'ar': 'Arabic',
        'az': 'Azerbaijani',
        'ba': 'Bashkir',
        'bn': 'Bengali',
        'bs': 'Bosnian',
        'zh': 'Chinese',
        'cs': 'Czech',
        'dv': 'Divehi, Dhivehi, Maldivian',
        'nl': 'Dutch, Flemish',
        'en': 'English',
        'fr': 'French',
        'de': 'German',
        'ha': 'Hausa',
        'hi': 'Hindi',
        'id': 'Indonesian',
        'it': 'Italian',
        'ja': 'Japanese',
        'ko': 'Korean',
        'ku': 'Kurdish',
        'ms': 'Malay',
        'no': 'Norwegian',
        'fa': 'Persian',
        'pl': 'Polish',
        'pt': 'Portuguese',
        'rm': 'Romansh',
        'ru': 'Russian',
        'sd': 'Sindhi',
        'si': 'Sinhala, Sinhalese',
        'so': 'Somali',
        'es': 'Spanish, Castilian',
        'sw': 'Swahili',
        'sv': 'Swedish',
        'tg': 'Tajik',
        'tt': 'Tatar',
        'th': 'Thai',
        'tr': 'Turkish',
        'ug': 'Uighur, Uyghur',
        'ur': 'Urdu',
        'uz': 'Uzbek',
      },
      fetchSurahFailed: false,
      loading: true,
      currentAyah: null,
      firstAyahNumber: null,
      showScrollGoToTopBtn: false
    }
  },
  methods: {
    async getSurahAyahs(surahId, readerId = 'ar.abdullahbasfar') {
      // Push surah id if not exists
      await this.$router.push({params: {id: surahId}})
      // Show loading
      this.loading = true
      // Get needed reader
      readerId = this.$cookies.get('reader-id') ?? readerId
      // Fetch surah data with reader audios
      this.axios.get(`https://api.alquran.cloud/v1/surah/${surahId}/${readerId}`)
          .then(data => data.data)
          .then(surah => {
            if (surah.code === 200) {
              // Assign array for make ayahs loop
              this.ayahs = surah.data.ayahs
              // Change failed status variable to false
              this.fetchSurahFailed = false
              // Set surah's simple data
              this.surahNo = surah.data.number
              this.surahName = surah.data.name
              this.revelationType = surah.data.revelationType
              this.numberOfAyahs = surah.data.numberOfAyahs
              // Get sounds
              this.getAyahSounds(this.ayahs)
              // Set surah and ayah data to the player
              this.currentAyah = surah.data.ayahs[0].number
              // Set first ayah number
              this.firstAyahNumber = surah.data.ayahs[0].number
              // Fetch surah translations, write types or tafsirs if user fetch it to the previous surah
              let change = new Event('change')
              if (this.ayahsTranslation.length > 0) {
                document.getElementById('translations-selector').dispatchEvent(change)
              }
              if (this.ayahsWriteType.length > 0) {
                document.getElementById('write-type-selector').dispatchEvent(change)
              }
              if (this.ayahsTafsir.length > 0) {
                document.getElementById('tafsir-selector').dispatchEvent(change)
              }
            } else {
              // Change failed status variable to false
              this.fetchSurahFailed = true
            }
          }).then(_ => {
        this.loading = false
      }).then(_ => {
        this.playAyahAudio(this.currentAyah)
      })
          .catch(() => {
            // Change failed status variable to true
            this.fetchSurahFailed = true
            // Change loading status variable to false
            this.loading = false
          })
    },
    getTranslations() {
      this.axios.get('https://api.alquran.cloud/v1/edition?format=text&type=translation')
          .then(data => data.data)
          .then(translations => {
            if (translations.code === 200) {
              // Assign array for make translations loop
              this.translations = translations.data
            }
          })
          .catch(e => {
            console.error(e)
          })
    },
    getWriteTypes() {
      this.axios.get('https://api.alquran.cloud/v1/edition/type/quran')
          .then(data => data.data)
          .then(types => {
            if (types.code === 200) {
              // Assign array for make write types loop
              this.writeTypes = types.data
            }
          })
          .catch(e => {
            console.error(e)
          })
    },
    getTafsirs() {
      this.axios.get('https://api.alquran.cloud/v1/edition/type/tafsir')
          .then(data => data.data)
          .then(tafsirs => {
            if (tafsirs.code === 200) {
              // Assign array for make write types loop
              this.tafsirs = tafsirs.data
            }
          })
          .catch(e => {
            console.error(e)
          })
    },
    getAyahsTranslations(translationId, translationOption) {
      if (translationId === '') {
        this.withoutTranslations = true
        return;
      }
      let surahNo = this.$route.params.id.length > 0 ? this.$route.params.id : 1
      this.axios.get(`https://api.alquran.cloud/v1/surah/${surahNo}/${translationId}`)
          .then(data => data.data)
          .then(translations => {
            this.selectedTranslationAuthorName = translationOption.text
            this.selectedTranslationDir = translationOption.dataset.direction
            this.selectedTranslationLangName = translationOption.parentNode.label
            this.ayahsTranslation = translations.data.ayahs
            this.withoutTranslations = false
          })
    },
    getAyahsWriteType(WriteTypeId, WriteTypeName) {
      if (WriteTypeId === '') {
        this.withoutWriteTypes = true
        return;
      }
      let surahNo = this.$route.params.id.length > 0 ? this.$route.params.id : 1
      this.axios.get(`https://api.alquran.cloud/v1/surah/${surahNo}/${WriteTypeId}`)
          .then(data => data.data)
          .then(WriteTypes => {
            this.selectedWriteTypeName = WriteTypeName
            this.ayahsWriteType = WriteTypes.data.ayahs
            this.withoutWriteTypes = false
          })
    },
    getAyahsTafsir(tafsirId, tafsirName) {
      if (tafsirId === '') {
        this.withoutTafsirs = true
        return;
      }
      let surahNo = this.$route.params.id.length > 0 ? this.$route.params.id : 1
      this.axios.get(`https://api.alquran.cloud/v1/surah/${surahNo}/${tafsirId}`)
          .then(data => data.data)
          .then(tafsirs => {
            this.selectedTafsirName = tafsirName
            this.ayahsTafsir = tafsirs.data.ayahs
            this.withoutTafsirs = false
          })
    },
    convertToArabicNumber(numbers) {
      // Arabic[Hindi] numbers
      const arabicNumbers = '\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669';
      // Replace string and return modified value in Arabic
      return String(numbers).replace(/[0123456789]/g, (d) => {
        return arabicNumbers[d]
      });
    },
    getAyahSounds(obj) {
      obj.forEach((ayah) => {
        this.sounds[ayah.number] = {}
        this.sounds[ayah.number]['main'] = ayah.audio
        this.sounds[ayah.number]['audioSecondary'] = ayah.audioSecondary
      })
      return this.sounds
    },
    async playAyahAudio(ayahNumber) {
      let audioSrc = this.sounds[ayahNumber].main
      // Remove highlighting from the old ayah
      this.highlightingAyah(this.currentAyah, 'remove')
      // Select audio low quality source if low quality selected
      if (this.$cookies.get('audio-quality') === 'low' && this.sounds[ayahNumber].audioSecondary.length > 0) {
        audioSrc = this.sounds[ayahNumber].audioSecondary[this.sounds[ayahNumber].audioSecondary.length - 1]
      }
      // Handle ayah audio playing
      await document.getElementById('player').pause()
      await document.getElementById('player').setAttribute('src', audioSrc)
      document.getElementById('player').play()
      // Assign new played ayah number
      this.currentAyah = ayahNumber
      // Add highlighting to the new ayah
      this.highlightingAyah(this.currentAyah)
    },
    switchAudio() {
      // If repeat scope is ayah
      if (this.$cookies.get('repeat-scope') === 'ayah') {
        return this.playAyahAudio(this.currentAyah)
      }
      // If surah ended
      if ((this.firstAyahNumber + this.numberOfAyahs - 1) === this.currentAyah) {
        // If repeat scope is all or null
        if (this.$cookies.get('repeat-scope') === 'all' || this.$cookies.get('repeat-scope') === null) {
          let surahNo = this.surahNo === 114 ? 1 : this.surahNo + 1
          return this.getSurahAyahs(surahNo)
        } else if (this.$cookies.get('repeat-scope') === 'surah') {
          return this.playAyahAudio(this.firstAyahNumber)
        }
      }
      // Play next ayah audio
      this.playAyahAudio(this.currentAyah + 1)
    },
    highlightingAyah(ayahBoxId, action = 'add') {
      let ayahBox = document.getElementById(ayahBoxId)
      if (!ayahBox) return;
      if (action === 'add') {
        ayahBox.classList.add('active')
      } else {
        ayahBox.classList.remove('active')
      }
    },
    changeReader(readerId) {
      this.$cookies.set('reader-id', readerId)
      this.getSurahAyahs(this.surahNo, readerId)
    },
    changeRepeatScope(scope) {
      this.$cookies.set('repeat-scope', scope)
    },
    changeAudioQuality(quality) {
      this.$cookies.set('audio-quality', quality)
    },
    scrollToActiveAyah(ayahId) {
      if (this.$cookies.get('tracking-ayah') !== 'true') return;
      window.scrollTo({
        top: document.getElementById(ayahId).getBoundingClientRect().top + window.scrollY - document.getElementById('main-nav').scrollHeight - 20,
        behavior: 'smooth'
      })
    },
    trackingAyah(tracking) {
      if (tracking) {
        this.$cookies.set('tracking-ayah', tracking)
        this.scrollToActiveAyah(this.currentAyah)
      } else {
        this.$cookies.set('tracking-ayah', tracking)
      }
    }
  },
  mounted() {
    // Fetch surah ayahs
    this.getSurahAyahs(this.$route.params.id !== '' ? this.$route.params.id : 1)
    // Fetch translations
    this.getTranslations()
    // Fetch write types
    this.getWriteTypes()
    // Fetch tasfirs
    this.getTafsirs()
    // Make player container is fixed when it hides at big scroll
    let playerContainerHeight = document.getElementById('player-container').clientHeight + 16  // 16 is the margin top of this element
    window.addEventListener('scroll', () => {
      let bodyTop = document.getElementById('body').getBoundingClientRect().top - document.getElementById('main-nav').scrollHeight - 20
      if (bodyTop < 0) {
        document.getElementById('player-container').classList.add('fixed')
        document.getElementsByTagName('body')[0].style.marginTop = `${playerContainerHeight}px`
        this.showScrollGoToTopBtn = true
      } else {
        document.getElementById('player-container').classList.remove('fixed')
        document.getElementsByTagName('body')[0].style.marginTop = '0'
        this.showScrollGoToTopBtn = false
      }
    })
  },
}
</script>