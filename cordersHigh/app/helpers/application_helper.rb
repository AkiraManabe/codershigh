module ApplicationHelper
	require "uri"

	#
	# FBから取得した文字列のリンク部分を<a>タグで囲う
	#
	def convert_links(text)
		URI.extract(text, ['http', 'https']).uniq.each do |url|
			sub_text = ""
			sub_text << "<a href=" << url << " target=\"_blank\">" << url << "</a>"

			text.gsub!(url, sub_text)
		end
		return text
	end

	#
	# Header, Footerなどlayouts配下のpartialを読み込み
	#
	def render_layout(layout)
		render(file: "layouts/#{layout}")
	end
end
