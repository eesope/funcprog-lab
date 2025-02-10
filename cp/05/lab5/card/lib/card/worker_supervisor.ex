defmodule Card.WorkerSupervisor do
  use DynamicSupervisor

  def start_link(_) do
    DynamicSupervisor.start_link(__MODULE__, nil, name: __MODULE__)
  end

  def start_worker(name) do
    DynamicSupervisor.start_child(__MODULE__, {Card.Worker, name})
  end

  def init(_arg) do
    DynamicSupervisor.init(strategy: :one_for_one, max_children: 5)
  end
end
