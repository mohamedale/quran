<template>
  <main>
    <div class="row">
      <div class="col-lg-4 col-md-6 text-center" v-for="surah in surahs.data">
        <router-link :to="{path: '/quran/' + surah.number}" class="surah-link text-decoration-none">
          <div class="item">
            <div class="row">
              <div class="col-3">
                <h3 class="number">
                  <span class="main-color-two">{{ surah.number }}</span>
                </h3>
              </div>
              <div class="col-9 main-color-one">
                <h4 class="name ketab-font">{{ surah.name }}</h4>
                <h6 class="revelation-type d-inline-block">{{
                    surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'
                  }}</h6>
                -
                <h6 class="num-of-ayahs d-inline-block main-color-two">عدد الآيات: <span>{{
                    surah.numberOfAyahs
                  }}</span></h6>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </main>
</template>

<style scoped>
.surah-link .item {
  background-color: #fff;
  margin-bottom: 1.5rem;
  padding: 1rem;
  border-radius: 1.5rem;
  transition: .3s all ease-in-out;
}

.surah-link .item:hover {
  transform: scale(1.05);
}

.surah-link .item .number {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.surah-link .item .number span {
  width: 3rem;
  height: 3rem;
  line-height: 3rem;
  border-radius: 50%;
  background-color: #41b88326;
  font-size: 1.4rem;
}

</style>

<script>
import surahsJson from "@/assets/json/surahs"

export default {
  data() {
    return {
      surahs: surahsJson,
    }
  },
}
</script>