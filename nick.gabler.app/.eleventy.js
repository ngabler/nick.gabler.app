module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("fonts");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("_headers");
};
