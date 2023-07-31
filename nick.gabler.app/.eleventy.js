module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("_headers");
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("fonts");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("scripts");
};
