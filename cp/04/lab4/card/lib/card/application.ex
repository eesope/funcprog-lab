defmodule Card.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    # processes under supervisor's manage
    children = [
      # order matters
      # Starts a worker by calling: Card.Worker.start_link(arg)
      {Card.Store, "cards.db"},
      {Card.Worker, 0}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Card.Supervisor]
    Supervisor.start_link(children, opts)
  end
end
