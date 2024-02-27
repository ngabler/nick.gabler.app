module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("_headers");
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("scripts");
  eleventyConfig.addPassthroughCopy("_data");
};
