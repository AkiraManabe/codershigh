class EventsController < ApplicationController

  # GET events
  # *dont correspond facebook paging API TODO?
  def index
    fb = FbApi.new
    @events = fb.get_events
  end

  # GET event detail
  def show
    id = params[:id]
    fb = FbApi.new
    @event = fb.get_event(id)
  end
end

