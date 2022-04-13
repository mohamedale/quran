<template>
  <footer>
    <div class="footer-main-content p-3">
      <p class="text-center m-0">تم التطوير بكل الـ❤️ بواسطة <a :href="'https://mohamed-abogabal.codes'" target="_blank">محمد
        على</a> | يمكنك المساهمة فى التطوير عبر
        <a :href="'https://github.com/mohamedale/quran'" target="_blank">Github</a> | جميع البيانات يتم جلبها من <a
            :href="'https://alquran.cloud/'" target="_blank">Al Quran Cloud</a></p>
    </div>
  </footer>
</template>

<style scoped>
footer {
  background-color: #fff;
  border-top: 1px solid #eee;
  font-size: 14px;
  color: #34495E;
}
footer .footer-main-content {
  display: flex;
  justify-content: center;
  align-items: center;
}
footer p a {
  text-decoration: none;
  color: #41B883;
}
</style>