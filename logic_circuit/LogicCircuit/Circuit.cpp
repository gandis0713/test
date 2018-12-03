#include "Circuit.h"

CCircuit::CCircuit() :
    m_pInGate(nullptr),
    m_pOutGate(nullptr)
{

}

CCircuit::~CCircuit()
{

}

void CCircuit::SetIn(CBASEGate *pBaseGate)
{
    m_pInGate = pBaseGate;
}

void CCircuit::SetOut(CBASEGate *pBaseGate)
{
    m_pOutGate = pBaseGate;
}