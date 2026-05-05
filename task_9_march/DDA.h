#ifndef DDA_H
#define DDA_H
#include <GL/glut.h>
#include <cmath>

class DDA
{
public:
    void draw(float x1, float y1, float x2, float y2)
    {
        float dx = x2 - x1;
        float dy = y2 - y1;
        float steps = std::max(std::abs(dx), std::abs(dy));

        float xIncrement = dx / steps;
        float yIncrement = dy / steps;

        float x = x1;
        float y = y1;

        glBegin(GL_POINTS);
        for (int i = 0; i <= steps; i++)
        {
            glVertex2f(round(x), round(y));
            x += xIncrement;
            y += yIncrement;
        }
        glEnd();
    }
};

#endif