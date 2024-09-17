hexo.extend.filter.register('after_render:html', function (data) {
  const posts = []
  hexo.locals.get('posts').map(function (post) {
    if (post.random !== false) posts.push(post.path)
  })
  data += `<script>var posts=${JSON.stringify(posts)};function toRandomPost(){ window.location.href = window.location.origin + posts[Math.floor(Math.random()*posts.length)]; };</script>`
  return data
})
