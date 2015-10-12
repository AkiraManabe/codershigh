require 'json'
require 'net/https'
require "date"

URL_FB = "https://graph.facebook.com/"
APP_VER = "v2.5/"
APP_ID = "534446970055025"
APP_SECRET = "27f62b9ac1f42c60ed16e5841dfa919c"

class FbApi
  def initialize
    # get applications AccessToken ex. Corder's High App submietted Facebook Center
    #@token = get_token
    @token = 'CAACEdEose0cBAA9NuE0fDm9pbZAn3j4wHWyipk36QrY5snnPuOCm1t5hjwYgUk9U3WIkpEcGaNVts5Adk7IRkzb6rSlY77A2pFH0RHLUQTOuvcgA3e5BIkbtoWN5vUqOZBS4lwZB92xLRDuEwY3qju30RhtOeZAsiQ5MsAPWuIfvyQfPLmfuuJUZCDk4Vt8SqZAlZC0Kix6qBoczjb7H3t9'
  end

  def get_fb_info(graph)
    uri = URI.parse(URL_FB + APP_VER + graph)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_NONE
    res = http.request(Net::HTTP::Get.new("#{uri.request_uri}&access_token=#{@token}"))
    return JSON.parse(res.body)
  end

  # return @events = Array[Hash{},...]
  def get_events
    begin
      graph = "1612054105726095/events?fields=picture,name,start_time,end_time,attending_count,place,description,updated_time"
      events = get_fb_info(graph)["data"]
      format_events(events)
      return events
    rescue => e
      STDERR.puts "[ERROR][#{self.class.name}.get_info] #{e}"
      exit 1
    end
  end

  # return @event = Hash{}
  def get_event(id)
    begin
      graph = id + "?fields=picture,name,start_time,end_time,attending_count,place,description,updated_time"
      event = get_fb_info(graph)
      format_event(event)
      return event
    rescue => e
      STDERR.puts "[ERROR][#{self.class.name}.get_info] #{e}"
      exit 1
    end
  end

  DATE_PARSE = "%Y/%m/%d (#{%w(日 月 火 水 木 金 土)[Time.now.wday]}) "
  TIME_PARSE = "%H:%M"

  def format_events(events)
    is_next = true
    events.each { |event|

      format_event(event)

      # TODO Is it no ploblem get most new date event
      event["is_next"] = is_next
      if is_next
        is_next = false
      end
    }
  end

  private def format_event(event)
    if event["picture"].blank?
      event["picture"] = {"data" => {"is_silhouette" => "", "url" => ""}}
    end

    if event["name"].blank?
      event["name"] = ""
    end

    datestr = ""
    timestr = ""
    if event["start_time"].blank?
      event["start_time"] = ""
    else
      d = DateTime.parse(event["start_time"])
      datestr = d.strftime(DATE_PARSE)
      timestr = d.strftime(TIME_PARSE)
    end
    timestr += "-"
    if event["end_time"].blank?
      event["end_time"] = ""
    else
      d = DateTime.parse(event["end_time"])
      if datestr.blank?
        datestr = d.strftime(DATE_PARSE)
      end
      timestr += d.strftime(TIME_PARSE)
    end
    event["datetime"] = datestr + timestr

    if event["description"].blank?
      event["description"] = ""
    end

    if event["place"].blank?
      event["place"] = {"name" => "", "location" => {"city" => "", "country" => "", "latitude" => "", "longitude" => "", "state" => "", "street" => "", "zip" => ""}}
    end

    if event["attending_count"].blank?
      event["attending_count"] = 0
    end

    event["is_next"] = false

  end

  # App Access Token 取得
  # *ここでのアクセストークンは、
  #  User に紐付いている User Access Token ではない。
  #  Facebook アプリに紐付いていている App Access Token のこと
  private def get_token
    begin
      uri = URI.parse("https://graph.facebook.com/oauth/access_token")
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      http.verify_mode = OpenSSL::SSL::VERIFY_NONE
      res = http.request(Net::HTTP::Get.new("#{uri.request_uri}?client_id=#{APP_ID}&client_secret=#{APP_SECRET}&grant_type=client_credentials"))
      return res.body.split("=")[1]
    rescue => e
      STDERR.puts "[ERROR][#{self.class.name}.get_token] #{e}"
      exit 1
    end
  end
end
