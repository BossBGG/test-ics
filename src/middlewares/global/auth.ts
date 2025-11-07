import axios from 'axios'

export default async function auth(to, from, next) {
  const userDataStore = useUserDataStore();
  const { userProfile, y3 } = storeToRefs(userDataStore);

  if (import.meta.env.VITE_APP_ENV != 'production') {
    const _username = to.query?.user;
    if (_username) {
      localStorage.setItem('mockUser', _username);
    }
    const username = localStorage.getItem('mockUser');
    if (username) {
      const auth = await axios.get('users/auth' + (username ? `/${username}` : ''));
      if (auth.data?.datas) {
        const userDataStore = useUserDataStore();
        await userDataStore.setUserProfile(auth.data.datas, auth.data?.y3, auth.data?.selectedPeaOffice, auth.data?.peaOffices);
      }
    }
  }


  const PAGE = {
    FORBIDDEN: "/forbidden"
  }

  // if (to.name != PAGE.FORBIDDEN) {
  //   if (!y3.value) {
  //     return next({
  //       name: PAGE.FORBIDDEN,
  //     })
  //   }
  // } else {
  //   if (y3.value) {
  //     return next({
  //       name: '/',
  //     })
  //   }
  // }


  // console.log('end auth 2');

  return next()
}
