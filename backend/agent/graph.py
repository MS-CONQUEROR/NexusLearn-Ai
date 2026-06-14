from langgraph.graph import StateGraph, END
from agent.state import AgentState
from agent.nodes import router_node, retriever_node, generator_node


def build_graph():
    """
    Builds and compiles the LangGraph agent.
    
    Flow:
    router → retriever → generator → END
    """

    graph = StateGraph(AgentState)

    # add all three nodes
    graph.add_node("router", router_node)
    graph.add_node("retriever", retriever_node)
    graph.add_node("generator", generator_node)

    # entry point — always start at router
    graph.set_entry_point("router")

    # router always goes to retriever
    graph.add_edge("router", "retriever")

    # retriever always goes to generator
    graph.add_edge("retriever", "generator")

    # generator ends the graph
    graph.add_edge("generator", END)

    return graph.compile()


# single instance used across the whole app
agent = build_graph()