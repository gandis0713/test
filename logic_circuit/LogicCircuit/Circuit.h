#include "../LogicGate/BASEgate.h"

class CCircuit
{
public:
    CCircuit();
    ~CCircuit();

    void SetIn(CBASEGate *pBaseGate);
    void SetOut(CBASEGate *pBaseGate);

private:
    CBASEGate *m_pInGate;
    CBASEGate *m_pOutGate;
};