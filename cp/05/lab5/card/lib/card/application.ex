defmodule Card.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Starts a worker by calling: Card.Worker.start_link(arg)
      # {Card.Worker, arg}
      {Registry, name: Card.Registry, keys: :unique},
      Card.WorkerSupervisor
    ]

    # ets table to store worker's state
    :ets.new(Card.Store, [:named_table, :public])

    opts = [strategy: :one_for_one, name: Card.Supervisor]
    Supervisor.start_link(children, opts)
  end
end
