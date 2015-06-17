require 'compass/import-once/activate'

##### Custom Functions
require 'sass'
require 'cgi'

module Sass::Script::Functions

  def inline_svg_image(path)
    real_path = File.join(Compass.configuration.images_path, path.value)
    svg = data(real_path)
    encoded_svg = CGI::escape(svg).gsub('+', '%20')
    data_url = "url('data:image/svg+xml;charset=utf-8," + encoded_svg + "')"
    Sass::Script::String.new(data_url)
  end

private

  def data(real_path)
    if File.readable?(real_path)
      File.open(real_path, "rb") {|io| io.read}
    else
      raise Compass::Error, "File not found or cannot be read: #{real_path}"
    end
  end

end

Encoding.default_external = "utf-8"
color_output = false

##### Require any additional compass plugins here.
# require 'sassy-math'

##### Project Settings
# Can be :stand_alone or :rails. Defaults to :stand_alone.
# project_type

# Not needed in :stand_alone mode where it can be inferred by context. Sets the path to the root of the project.
# project_path

# The environment mode. Defaults to :development, can also be :production
# environment

# Output verbose messages when an error occurs during compile
debug = false

# The path to the project when running within the web server. Defaults to "/".
http_path = "."

# Set this to true to silence deprecation warnings.
# disable_warnings

# These options are passed directly to the Sass compiler. For more details on the format of sass options, please read the sass options documentation.
# sass_options

# Can be :scss or :sass. Defaults to :scss.
# preferred_syntax = :sass

# The output style for the compiled css. One of: :nested, :expanded, :compact, or :compressed.
output_style = :expanded

# Indicates whether the compass helper functions should generate relative urls from the generated css to assets, or absolute urls using the http path for that asset type. Defaults to false
# relative_assets = true

# Indicates whether line comments should be added to compiled css that says where the selectors were defined. Defaults to false in production mode, true in development mode.
line_comments = false

# Set this to true to enable sourcemap output. Defaults to false.
sourcemap = true

# Specify the number of decimal places to round to
Sass::Script::Number.precision = 3

##### CSS Settings
# The directory where the css stylesheets are kept. It is relative to the project_path. Defaults to "stylesheets".
css_dir = "dist"

# The full path to where css stylesheets are kept. Defaults to <project_path>/<css_dir>.
# css_path

# The full http path to stylesheets on the web server. Defaults to http_path + "/" + css_dir.
# http_stylesheets_path

# The directory where the sass stylesheets are kept. It is relative to the project_path. Defaults to "sass".
# sass_dir = "scss"

sass_dir = "src"

# The full path to where sass stylesheets are kept. Defaults to <project_path>/<sass_dir>.
# sass_path

# Other paths on your system from which to import sass files. See the add_import_path function for a simpler approach.
# additional_import_paths

##### Image Settings
# The directory where the images are kept. It is relative to the project_path. Defaults to "images".
# images_dir = "img"

images_dir = "assets/images"

# The full path to where images are kept. Defaults to <project_path>/<images_dir>.
# images_path

# The full http path to images on the web server. Defaults to http_path + "/" + images_dir.
# http_images_path

# The directory where generated images are kept. It is relative to the project_path. Defaults to the value of images_dir.
# generated_images_dir = "img"

generated_images_dir = "dist/images"

# The full path to where generated images are kept. Defaults to the value of <project_path>/<generated_images_dir>.
# generated_images_path

# The full http path to generated images on the web server. Defaults to http_path + "/" + generated_images_dir.
# http_generated_images_path

# Defaults to :chunky_png
# sprite_engine

# Defaults to {:compression => Zlib::BEST_COMPRESSION}. See the chunky_png wiki for more information
# chunky_png_options

# Defaults to [images_path]
# sprite_load_path

##### Web Font Settings
# The directory where the font files are kept. Standalone projects will default to <css_dir>/fonts. Rails projects will default to "public/fonts".
# fonts_dir

# The full path to where font files are kept. Defaults to <project_path>/<fonts_dir>.
# fonts_path

# The full http path to font files on the web server.
# http_fonts_path

# The relative http path to font files on the web server.
# http_fonts_dir

##### Javascript Settings
# The directory where the javascripts are kept. It is relative to the project_path. Defaults to "javascripts".
# javascripts_dir

# The full path to where javascripts are kept. Defaults to <project_path>/<javascripts_dir>.
# javascripts_path

# The full http path to javascripts on the web server. Defaults to http_path + "/" + javascripts_dir.
# http_javascripts_path
